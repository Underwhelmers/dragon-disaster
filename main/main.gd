extends Control

var leftop: Dictionary
var rightop: Dictionary



func _ready():
	Events.on_next_card.connect(next_card)
	Events.on_swipe_left.connect(swipe_left)
	Events.on_swipe_right.connect(swipe_right)
	
	Events.pj_set.connect(pj_set)
	Events.begin_run.connect(begin_run)
	Events.pj_features.connect(pj_features)
	
	next_card()

func next_card():
	#var acts := ActionStateMachine.get_valid_actions()
	#var action = acts.pop_front()
	var action = ActionStateMachine.pop_valid_action()
	
	var ops = ActionStateMachine.get_valid_ops(action.name)
	leftop = ops[0]
	rightop = ops[1]
	
	var line = ""
	for t in ActionStateMachine.triggers:
		line += NpcResponseGenerator.get_line(t)
	
	Events.card_set({
		"title":action.text,
		"her_input": line,
		"left":leftop.text,
		"right":rightop.text
	})

func swipe_left():
	ActionStateMachine.execute_op(leftop)

func swipe_right():
	ActionStateMachine.execute_op(rightop)

func pj_set(data):
	var value = data[0]
	var amnt = data[1]
	ActionStateMachine.values[value] = int(amnt)

func begin_run(data):
	var mode = data[0]
	if mode == "random":
		return

func pj_features(data):
	var _features = data[0]
	var _value = data[1]
