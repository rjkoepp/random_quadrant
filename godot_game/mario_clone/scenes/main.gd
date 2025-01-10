extends Node2D

var camera_speed = 100  # pixels per second
var player_position = Vector2(100, 300)  # initial player position

func _ready():
	# Initialize game state
	$Player.position = player_position
	$Camera2D.position.x = player_position.x

func _process(delta):
	# Move camera automatically (sliding window)
	$Camera2D.position.x += camera_speed * delta
	
	# Keep player within camera bounds
	var camera_left = $Camera2D.position.x - get_viewport_rect().size.x / 2
	var camera_right = $Camera2D.position.x + get_viewport_rect().size.x / 2
	
	if $Player.position.x < camera_left:
		$Player.position.x = camera_left
	elif $Player.position.x > camera_right:
		$Player.position.x = camera_right
