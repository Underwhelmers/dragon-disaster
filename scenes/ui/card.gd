extends Panel

# Swipe configuration
var is_dragging: bool = false
var is_animating: bool = false
@export var swipe_threshold: float = 400.0
var swipe_speed_threshold: float = 100.0

# Tracking state
var start_pos: Vector2 = Vector2.ZERO
var prev_pos: Vector2 = Vector2.ZERO
var swipe_valid: bool = false

# Visuals
var neutral_color: Color = Color(1, 1, 1, 1)
var left_color: Color = Color(0.7, 0.85, 1, 1)
var right_color: Color = Color(0.7, 0.85, 1, 1)
var rotation_max: float = 25.0

# Updates
var text: Label
var title: Label
@export var choice: Label
var choice_int: Label
var left_choice: String
var right_choice: String

# --- Helper: Center Position ---
func get_center_position() -> Vector2:
	if !is_inside_tree(): return Vector2(0,0)
	
	var fullcenter = get_viewport_rect().size / 2 - size / 2
	return Vector2(fullcenter.x, position.y)

func _ready():
	position = get_center_position()
	Events.on_card_set.connect(set_values)
	choice_int = $Choice
	text = $Text
	title = $Title
	
	if choice: choice.modulate.a = 0
	choice_int.modulate.a = 0
	text.modulate.a = 1
	title.modulate.a = 1

# --- Input Events ---
func _gui_input(event):
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_on_touch_started(position)
		else:
			_on_touch_ended(position)
	elif event is InputEventMouseMotion:
		if event.button_mask & MOUSE_BUTTON_MASK_LEFT:
			_on_drag(event.relative)

	if event is InputEventScreenTouch:
		if event.pressed:
			_on_touch_started(position)
		else:
			_on_touch_ended(position)
	elif event is InputEventScreenDrag:
		_on_drag(event.relative)

# --- Touch Logic ---
func _on_touch_started(pos: Vector2):
	is_dragging = true
	start_pos = pos
	prev_pos = pos

func _on_drag(delta: Vector2):
	if !is_dragging:
		return
	position.x += delta.x
	prev_pos = position
	
	# Color feedback
	var xdisp = position.x - start_pos.x
	var lerp_lag = 1.2
	var lerp_module = lerp_lag * abs(xdisp) / swipe_threshold -(lerp_lag-1)
	var lerp_factor = clamp(lerp_module, 0.0, 1.0)
	
	if choice: choice.modulate.a = lerp_factor
	choice_int.modulate.a = lerp_factor
	text.modulate.a = 1-lerp_factor
	title.modulate.a = 1-lerp_factor
	
	if xdisp < 0: 
		_left_feedback(xdisp,lerp_factor)
	else: 
		_right_feedback(xdisp,lerp_factor)

func _left_feedback(xdisp, lerp_factor):
	if choice: choice.text = left_choice
	choice_int.text = left_choice
	rotation_degrees = (lerp_factor) * rotation_max * sign(xdisp)
	modulate = neutral_color.lerp(left_color, lerp_factor * lerp_factor)

func _right_feedback(xdisp, lerp_factor):
	if choice: choice.text = right_choice
	choice_int.text = right_choice
	rotation_degrees = (lerp_factor) * rotation_max * sign(xdisp)
	modulate = neutral_color.lerp(right_color, lerp_factor * lerp_factor)

func _on_touch_ended(pos: Vector2):
	if !is_dragging: return
	is_dragging = false

	var distance = pos.x - start_pos.x
	var velocity = pos.x - prev_pos.x  # simple approximation

	swipe_valid = abs(distance) > swipe_threshold or abs(velocity) > swipe_speed_threshold

	if swipe_valid:
		if distance > 0:
			tween_swipe_right()
		else:
			tween_swipe_left()
	else:
		tween_back_to_center()

# --- Tweens ---
func tween_swipe_left():
	is_animating = true
	var tween = create_tween()

	tween.tween_property(self, "position:x", position.x - get_viewport_rect().size.x, 0.3)
	tween.parallel().tween_property(self, "modulate", left_color, 0.3)
	tween.tween_callback(Events.swipe_left)
	tween.tween_callback(reset_card)
	

func tween_swipe_right():
	is_animating = true
	var tween = create_tween()

	tween.tween_property(self, "position:x", position.x + get_viewport_rect().size.x, 0.3)
	tween.parallel().tween_property(self, "modulate", right_color, 0.3)
	tween.tween_callback(Events.swipe_right)
	tween.tween_callback(reset_card)

func tween_back_to_center():
	is_animating = true
	var tween = create_tween()

	tween.tween_property(self, "position", get_center_position(), 0.2)
	tween.parallel().tween_property(self, "rotation_degrees", 0, 0.2)
	tween.parallel().tween_property(self, "modulate", neutral_color, 0.2)
	if choice: tween.parallel().tween_property(self, "choice:modulate:a", 0, 0.2)
	tween.parallel().tween_property(self, "choice_int:modulate:a", 0, 0.2)
	tween.parallel().tween_property(self, "text:modulate:a", 1, 0.2)
	tween.parallel().tween_property(self, "title:modulate:a", 1, 0.2)
	tween.tween_callback(func(): is_animating = false)

# --- Reset ---
func reset_card():
	is_animating = false
	position = get_center_position()
	modulate = neutral_color
	rotation_degrees = 0
	if choice: choice.modulate.a = 0
	choice_int.modulate.a = 0
	text.modulate.a = 1
	title.modulate.a = 1
	
	Events.next_card();

func set_values(data):
	title.text = data.title;
	text.text = data.her_input;
	left_choice = data.left;
	right_choice = data.right;
