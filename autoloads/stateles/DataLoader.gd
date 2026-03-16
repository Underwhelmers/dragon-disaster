extends Node

func load_json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path): 
		push_error("file does not exists: ", path); 
		return {}
	
	print("loading: ", path)
	var file = FileAccess.open(path, FileAccess.READ)
	var json = JSON.parse_string(file.get_as_text())
	file.close()
	return json if json is Dictionary else {}

func load_json_for(path: String) -> Dictionary:
	path = "res://data/{0}.json".format([path])
	return load_json(path)
