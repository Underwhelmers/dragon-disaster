extends Node

var actions_data: Dictionary = {}
var pending_actions: Dictionary = {}
var state: Array = [] # your current tags
var triggers: Array = [] # temporal triggered events
var values: Dictionary = {}

func _init():
	load_actions("cards/scene1")
	load_actions("cards/scene2")
	#load_actions("cards/test-repeat")
	
	var data := DataLoader.load_json_for("config/state-machine")
	state = data.initial_state
	
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
			if tag not in state:
				state.append(tag)

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
	
func get_valid_actions() -> Array:
	var result: Array = []

	for action_name in pending_actions.keys():
		var action = actions_data[action_name]
		
		if action.has("req") and not has_all(action["req"]):
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
			"order": action.get("req",[]).size()
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

func get_valid_ops(action_name: String) -> Array:
	if action_name == "watching the aviss":
		return aviss_action()
	
	if not actions_data.has(action_name):
		push_error("Action not found: " + action_name)
		return []

	var ops: Array = actions_data[action_name].get("ops", [])
	var result: Array = []

	for op in ops:
		if op.has("req"):
			if not has_all(op["req"]):
				continue
		result.append(op)
	
	result.shuffle()
	result.sort_custom(func(a,b): 
		return a.get("req",[]).size() > b.get("req",[]).size()
	)
	for it in result: print(it)
	return result

func execute_op(op: Dictionary):
	triggers.clear()
	
	var eff = op.get("eff", {})
	apply_effect(eff)

	return eff


func aviss_action():
	var result = []
	
	#for t in state:
	#	result.append({ "text": "NO "+t, "eff": { "removes":[t] } })
	
	while result.size() < 2:
		result.append({ "text": "Let's go back...", "eff": { "exec":["restart"] } })
	
	return result
