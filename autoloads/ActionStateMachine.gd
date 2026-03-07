extends Node

var actions_data: Dictionary = {}
var pending_actions: Dictionary = {}
var state: Array = [] # your current tags
var triggers: Array = [] # temporal triggered events
var values: Dictionary = {}

func _init():
	var data := DataLoader.load_json_for("config/state-machine")
	state = data.initial_state
	
	for file in data.files_to_load:
		load_actions(file)
	
	#load_actions("cards/test-scene1")
	#load_actions("cards/scene2")
	#load_actions("cards/test-repeat")
	
	if actions_data.is_empty():
		push_error("ActionStateMachine: Could not load actions")

func restart():
	actions_data = {}
	pending_actions = {}
	state = []
	triggers = []
	values = {}
	_init()

func load_actions(path):
	var raw := DataLoader.load_json_for(path)
	var parsed = GenericActionParser.parse_actions(raw)
	actions_data.merge(parsed)
	pending_actions.merge(parsed)

func has_all(reqs: Array) -> bool:
	for r in reqs:
		if r.begins_with("!"):
			var tag = r.substr(1)
			if tag in state:
				return false
			if tag in triggers:
				return false
		else:
			var missing = r not in state and r not in triggers
			if missing:
				return false
	return true

func apply_effect(eff: Dictionary):
	if eff.has("adds"):
		for tag in eff["adds"]:
			add_tag(tag)

	if eff.has("removes"):
		for tag in eff["removes"]:
			state.erase(tag)

	if eff.has("triggers"):
		for t in eff["triggers"]:
			triggers.append(t)
	
	if eff.has("inc"):
		var incs = eff["inc"]
		for val in incs.keys():
			if !values.has(val):
				values[val] = 0
			values[val] += incs[val]
	
	if eff.has("red"):
		var incs = eff["red"]
		for val in incs.keys():
			if !values.has(val):
				values[val] = 0
			values[val] -= incs[val]
	
	if eff.has("exec"):
		var scrs = eff["exec"]
		Events.execute_signal(scrs.duplicate())

func add_tag(tag: String) -> void:
	if tag in state: return
	var prefix = tag.get_slice(":", 0) + ":"
	
	if tag.contains(":"):
		state = state.filter(func(t): return !t.begins_with(prefix))
	
	state.append(tag)

func get_valid_actions() -> Array:
	var result: Array = []

	for action_name in pending_actions.keys():
		var action = actions_data[action_name]
		
		if not has_all(action.get("req",[])):
			continue
		
		result.append({
			"name": action_name,
			"text": action.get("text", ""),
		})
	
	if result.size() == 0:
		result.append({
			"name": "watching the aviss",
			"text": "This story is finished.\nBut this is not the only path.",
		})
		
	result.shuffle()
	result.sort_custom(func(a,b): 
		return a.get("req",[]).size() > b.get("req",[]).size()
	)
	return result

func pop_valid_action():
	var result: Array = []

	for action_name in pending_actions.keys():
		var action = actions_data[action_name]
		
		if action.has("req") and not has_all(action["req"]):
			continue
		
		result.append({
			"name": action_name,
			"text": action.get("text", ""),
			"order": action.get("order", action.get("req",[]).size())
		})
	
	if result.size() == 0:
		result.append({
			"name": "watching the aviss",
			"text": "This story is finished.\nBut this is not the only path.",
			"order": 0
		})
	
	result.shuffle()
	result.sort_custom(func(a,b): return a.order > b.order)
	
	var top = result.pop_front()
	pending_actions.erase(top.name)
	return top

func get_valid_ops(action_name: String) -> Dictionary:
	if action_name == "watching the aviss":
		return {
			"left" : { "text": "Let's go back...", "eff": { "exec":["restart"] } },
			"right": { "text": "Let's go back...", "eff": { "exec":["restart"] } }
		}
	
	if not actions_data.has(action_name):
		push_error("Action not found: " + action_name)
		return {
			"left" : { "text": "Reset...", "eff": { "exec":["restart"] } },
			"right": { "text": "Reset...", "eff": { "exec":["restart"] } }
		}

	var ops: Array = actions_data[action_name].get("ops", [])
	var resultL: Array = []
	var resultR: Array = []
	var resultOth: Array = []

	for op in ops:
		if op.has("req"):
			if not has_all(op["req"]):
				continue
		
		if not op.has("order"): op["order"] = op.get("req",[]).size()
		
		if op.has("side") and op["side"] == "left": resultL.append(op)
		elif op.has("side") and op["side"] == "right": resultR.append(op)
		else: resultOth.append(op)
	
	resultOth.shuffle()
	resultL.sort_custom(sort_opts)
	resultR.sort_custom(sort_opts)
	
	return {
		"left": take_or_random(resultL,resultOth),
		"right": take_or_random(resultR,resultOth)
	}

func take_or_random(arr: Array, fallback: Array):
	return fallback.pick_random() if arr.is_empty() else arr.pop_front()

func sort_opts(a,b) -> bool:
	return a.order > b.order

func execute_op(op: Dictionary):
	triggers.clear()
	
	var eff = op.get("eff", {})
	apply_effect(eff)

	return eff
