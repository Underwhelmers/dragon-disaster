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



signal begin_run;
signal pj_features;
signal pj_set;

func execute_signal(data: Array):
	var script = data.pop_front()
	match script:
		# Game action
		"pj_set": pj_set.emit(data)
		"begin_run": begin_run.emit(data)
		"pj_features": pj_features.emit(data)
		
		#Engine actions
		"restart": _restart()
		"exit_game": _exit_game()
		"hard_close_game": _hard_close_game()
		_: print("Unknown script: ", script, data)


func _restart():
	print("State: ", ActionStateMachine.state)
	print("Triggers: ", ActionStateMachine.triggers)
	
	# Disconect all signs for the game actions
	for sig_dict in get_signal_list():
		var sig_name: StringName = sig_dict["name"]
		for conn in get_signal_connection_list(sig_name):
			disconnect(sig_name, conn["callable"])
	
	ActionStateMachine.restart()
	NpcResponseGenerator.restart()
	get_tree().reload_current_scene()

func _hard_close_game():
	get_tree().quit()
	
func _exit_game():
	get_tree().change_scene_to_file("res://scenes/main-menu/main-menu.tscn")
