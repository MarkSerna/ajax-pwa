<?php
header('Content-Type: application/json');
$dsn = 'mysql:host=localhost;dbname=sistema_facturacion;charset=utf8';
$username = 'root';
$password = '';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'add':
            $nombre = $_POST['nombre'];
            $email = $_POST['email'];
            $telefono = $_POST['telefono'];
            $contrasenia = $_POST['contrasenia'];
            //$contrasenia = password_hash($_POST['contrasenia'], PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, telefono, password, sincronizado) VALUES (?, ?, ?, ?, 1)");
            $stmt->execute([$nombre, $email, $telefono, $contrasenia]);
            echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito.']);
            break;

        case 'update':
            $id = $_POST['id'];
            $nombre = $_POST['nombre'];
            $email = $_POST['email'];
            $telefono = $_POST['telefono'];
            $contrasenia = $_POST['contrasenia'];
            //$contrasenia = password_hash($_POST['contrasenia'], PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, password = ?, sincronizado = 1 WHERE id = ?");
            $stmt->execute([$nombre, $email, $telefono, $contrasenia, $id]);
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito.']);
            break;

        case 'delete':
            $id = $_POST['id'];
            $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Usuario eliminado con éxito.']);
            break;

        case 'fetch':
            if (isset($_POST['id'])) {
                $id = $_POST['id'];  // Obtener el ID del usuario
                $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
                $stmt->execute([$id]);
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($usuario) {
                    echo json_encode($usuario); // Enviar el usuario específico
                } else {
                    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
                }
            } else {
                $stmt = $pdo->query("SELECT * FROM usuarios");
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($usuarios); // Enviar todos los usuarios si no hay ID
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            $stmt = $pdo->query("SELECT * FROM usuarios");
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($usuarios); // Enviar todos los usuarios si no hay ID
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
