extends Node

signal on_swipe_left;
signal on_swipe_right;
signal on_card_set(data);
signal on_next_card;

func swipe_left():
	on_swipe_left.emit()
	
func swipe_right():
	on_swipe_right.emit()

func next_card():
	on_next_card.emit()

func card_set(data):
	on_card_set.emit(data)

func _restart():
	print("State: ", ActionStateMachine.state)
	print("Triggers: ", ActionStateMachine.triggers)
	
	clear_all_signals()
	ActionStateMachine.restart()
	NpcResponseGenerator.restart()
	get_tree().reload_current_scene()

func clear_all_signals() -> void:
	for sig_dict in get_signal_list():
		var sig_name: StringName = sig_dict["name"]  # Dict keys: "name", "args", etc.
		for conn in get_signal_connection_list(sig_name):
			disconnect(sig_name, conn["callable"])  # Keys: "signal"(Signal), "callable", "flags"

func _hard_close_game():
	get_tree().quit()

signal begin_run;
signal pj_features;
signal pj_set;
signal hard_close_game;

func execute_signal(data: Array):
	var script = data.pop_front()
	match script:
		"pj_set": pj_set.emit(data)
		"begin_run": begin_run.emit(data)
		"pj_features": pj_features.emit(data)
		"hard_close_game": _hard_close_game()
		"restart": _restart()
		_: print("Unknown script: ", script, data)
