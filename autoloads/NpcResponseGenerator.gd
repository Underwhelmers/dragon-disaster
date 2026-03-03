extends Node

var talk_data: Dictionary = {}
var rng := RandomNumberGenerator.new()

func _init():
	load_talk("npc/triggers-responses")
	if talk_data.is_empty():
		push_error("Npc response data failed to load.")

func restart():
	talk_data = {}
	_init()

func load_talk(path):
	talk_data.merge(DataLoader.load_json_for(path))

# -------------------------------------------------------------------------
# Returns one line based on trigger + optional state
# -------------------------------------------------------------------------
func get_line(trigger: String, _state: Array = []) -> String:
	if not talk_data.has(trigger):
		return ""   # no line for this trigger

	var pool: Array = talk_data[trigger]
	if pool.is_empty():
		return ""

	rng.randomize()
	return pool[rng.randi_range(0, pool.size() - 1)]
