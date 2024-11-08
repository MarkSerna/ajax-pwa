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
            $id_usuario = $_POST['id_usuario'];
            $permiso = $_POST['permiso'] ?? 'viewer'; // Asignar "visualizador" por defecto

            // Verificar si el usuario ya tiene un permiso asignado
            $stmt = $pdo->prepare("SELECT * FROM permisos_usuario WHERE id_usuario = ?");
            $stmt->execute([$id_usuario]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'El usuario ya tiene un permiso asignado.']);
                exit;
            }

            // Si no tiene permiso, proceder con la inserción
            $stmt = $pdo->prepare("INSERT INTO permisos_usuario (id_usuario, permiso) VALUES (?, ?)");
            $stmt->execute([$id_usuario, $permiso]);
            echo json_encode(['success' => true, 'message' => 'Permiso agregado con éxito.']);
            break;

        case 'update':
            $id = $_POST['id'];
            $permiso = $_POST['permiso'];

            $stmt = $pdo->prepare("UPDATE permisos_usuario SET permiso = ? WHERE id_permiso = ?");
            $stmt->execute([$permiso, $id]);
            echo json_encode(['success' => true, 'message' => 'Permiso actualizado con éxito.']);
            break;

        case 'delete':
            $id = $_POST['id'];
            $stmt = $pdo->prepare("DELETE FROM permisos_usuario WHERE id_permiso = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Permiso eliminado con éxito.']);
            break;

        case 'fetch':
            if (isset($_POST['id'])) {
                $id = $_POST['id'];
                $stmt = $pdo->prepare("
                    SELECT p.*, u.nombre as usuario_nombre 
                    FROM permisos_usuario p 
                    LEFT JOIN usuarios u ON p.id_usuario = u.id 
                    WHERE p.id_permiso = ?
                ");
                $stmt->execute([$id]);
                $permiso = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($permiso);
            } else {
                $id_usuario = $_POST['id_usuario'] ?? null;
                $query = "
                    SELECT p.*, u.nombre as usuario_nombre 
                    FROM permisos_usuario p 
                    LEFT JOIN usuarios u ON p.id_usuario = u.id
                ";
                if ($id_usuario) {
                    $query .= " WHERE p.id_usuario = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$id_usuario]);
                } else {
                    $stmt = $pdo->query($query);
                }
                $permisos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($permisos);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
