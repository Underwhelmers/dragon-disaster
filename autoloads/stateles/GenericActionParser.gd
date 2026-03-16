extends Node

func parse_actions(raw: Dictionary):
	if raw.is_empty(): return
	var expanded := {}

	for key in raw.keys():
		var entry = raw[key]
		if entry.has("params"):
			var param_dict = entry["params"]
			var combos = _expand_param_combinations(param_dict)

			for combo in combos:
				# Replace placeholders in:
				# - action name
				# - req / text / ops
				var new_key = _apply_placeholders(key, combo)
				var new_entry = _deep_copy(entry)
				new_entry.erase("params")  # remove params since this is now concrete
				new_entry = _apply_placeholders_recursive(new_entry, combo)
				expanded[new_key] = new_entry
		else:
			# Not templated → copy as normal
			expanded[key] = entry
	
	return expanded

func _deep_copy(v):
	return JSON.parse_string(JSON.stringify(v))

func _apply_placeholders_recursive(value, combo: Dictionary):
	if value is String:
		return _apply_placeholders(value, combo)

	if value is Array:
		var arr := []
		for element in value:
			arr.append(_apply_placeholders_recursive(element, combo))
		return arr

	if value is Dictionary:
		var dict := {}
		for k in value.keys():
			var new_k = _apply_placeholders(k, combo)
			dict[new_k] = _apply_placeholders_recursive(value[k], combo)
		return dict
	return value

func _apply_placeholders(s: String, combo: Dictionary) -> String:
	var out = s
	for p in combo.keys():
		out = out.replace("[" + p + "]", combo[p])
	return out

func _expand_param_combinations(param_dict: Dictionary) -> Array:
	var keys = param_dict.keys()
	var lists = []
	for k in keys:
		lists.append(param_dict[k])

	var results := []
	_expand_recursive(keys, lists, 0, {}, results)
	return results

func _expand_recursive(keys, lists, index, current: Dictionary, results: Array):
	if index >= keys.size():
		results.append(current.duplicate())
		return

	var p = keys[index]
	for val in lists[index]:
		current[p] = val
		_expand_recursive(keys, lists, index + 1, current, results)
