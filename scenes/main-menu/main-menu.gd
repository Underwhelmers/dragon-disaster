extends Node

@export var button_scene: PackedScene
@onready var button_container = $ButtonContainer

func  _ready():
	load_gamemode_buttons()
	
func load_gamemode_buttons():
	var config_json = ActionStateMachine.config
	
	for key in config_json.keys():
		if !key.begins_with("gamemode:"):
			continue
		
		var mode_id = key.trim_prefix("gamemode:")
		var label = format_mode_name(mode_id)
		create_button(mode_id, label)

func format_mode_name(id: String) -> String:
	var text = id.replace("-", " ")
	return text.capitalize()

func create_button(mode_id: String, label: String):
	var button = button_scene.instantiate()
	button.text = label
	button.pressed.connect(_on_mode_pressed.bind(mode_id))
	button_container.add_child(button)

func _on_mode_pressed(mode_id: String):
	print("Selected mode:", mode_id)
	ActionStateMachine.load_gamemode(mode_id);
	get_tree().change_scene_to_file("res://scenes/card-handler/card-handler.tscn")
