extends CharacterBody2D

const SPEED = 50.0
var direction = -1

func _physics_process(delta):
	# Simple left-right movement
	velocity.x = direction * SPEED
	
	# Change direction if hitting a wall
	if is_on_wall():
		direction *= -1
	
	move_and_slide()

func _on_hitbox_body_entered(body):
	if body.name == "Player":
		# If player hits from above, enemy dies
		var player_feet = body.position.y + body.get_node("CollisionShape2D").shape.size.y/2
		var enemy_top = position.y - get_node("CollisionShape2D").shape.size.y/2
		
		if player_feet < enemy_top + 10:  # Small threshold for top collision
			queue_free()
		else:
			# Player takes damage/dies
			body.position = Vector2(100, 300)  # Respawn point
