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
            $pdo->beginTransaction();
            try {
                $id_cliente = $_POST['id_cliente'];
                $id_usuario = $_POST['id_usuario'];
                $total = $_POST['total'];

                $stmt = $pdo->prepare("INSERT INTO facturas (id_cliente, id_usuario, total) VALUES (?, ?, ?)");
                $stmt->execute([$id_cliente, $id_usuario, $total]);
                
                $id_factura = $pdo->lastInsertId();
                
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Factura creada con éxito.', 'id_factura' => $id_factura]);
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
            break;

        case 'update':
            $id = $_POST['id'];
            $id_cliente = $_POST['id_cliente'];
            $id_usuario = $_POST['id_usuario'];
            $total = $_POST['total'];

            $stmt = $pdo->prepare("UPDATE facturas SET id_cliente = ?, id_usuario = ?, total = ? WHERE id_factura = ?");
            $stmt->execute([$id_cliente, $id_usuario, $total, $id]);
            echo json_encode(['success' => true, 'message' => 'Factura actualizada con éxito.']);
            break;

        case 'delete':
            $id = $_POST['id'];
            $stmt = $pdo->prepare("DELETE FROM facturas WHERE id_factura = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Factura eliminada con éxito.']);
            break;

        case 'fetch':
            if (isset($_POST['id'])) {
                $id = $_POST['id'];
                $stmt = $pdo->prepare("
                    SELECT f.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre 
                    FROM facturas f 
                    LEFT JOIN clientes c ON f.id_cliente = c.id_cliente 
                    LEFT JOIN usuarios u ON f.id_usuario = u.id 
                    WHERE f.id_factura = ?
                ");
                $stmt->execute([$id]);
                $factura = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($factura);
            } else {
                $stmt = $pdo->query("
                    SELECT f.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre 
                    FROM facturas f 
                    LEFT JOIN clientes c ON f.id_cliente = c.id_cliente 
                    LEFT JOIN usuarios u ON f.id_usuario = u.id
                ");
                $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($facturas);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}