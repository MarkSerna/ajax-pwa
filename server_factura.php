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
            $id_cliente = $_POST['id_cliente'];
            $fecha = $_POST['fecha'];
            $total = $_POST['total'];

            $stmt = $pdo->prepare("INSERT INTO facturas (id_cliente, fecha, total) VALUES (?, ?, ?)");
            $stmt->execute([$id_cliente, $fecha, $total]);

            echo json_encode(['success' => true, 'message' => 'Factura agregada con éxito']);
            break;

        case 'update':
            $id = $_POST['id'];
            $id_cliente = $_POST['id_cliente'];
            $fecha = $_POST['fecha'];
            $total = $_POST['total'];

            $stmt = $pdo->prepare("UPDATE facturas SET id_cliente = ?, fecha = ?, total = ? WHERE id_factura = ?");
            $stmt->execute([$id_cliente, $fecha, $total, $id]);

            echo json_encode(['success' => true, 'message' => 'Factura actualizada con éxito']);
            break;

        case 'delete':
            $id = $_POST['id'];

            $stmt = $pdo->prepare("DELETE FROM facturas WHERE id_factura = ?");
            $stmt->execute([$id]);

            echo json_encode(['success' => true, 'message' => 'Factura eliminada con éxito']);
            break;

        case 'fetch':
            if (isset($_POST['id'])) {
                $id = $_POST['id'];
                $stmt = $pdo->prepare("SELECT f.*, c.nombre as cliente_nombre FROM facturas f LEFT JOIN clientes c ON f.id_cliente = c.id_cliente WHERE f.id_factura = ?");
                $stmt->execute([$id]);
                $factura = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($factura);
            } else {
                $stmt = $pdo->query("SELECT f.*, c.nombre as cliente_nombre FROM facturas f LEFT JOIN clientes c ON f.id_cliente = c.id_cliente ORDER BY f.fecha DESC");
                $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($facturas);
            }
            break;

        case 'getProducts':
            $facturaId = $_POST['id'];
            $stmt = $pdo->prepare("
                SELECT p.*, df.cantidad
                FROM productos p
                INNER JOIN detalle_factura df ON p.id_producto = df.id_producto
                WHERE df.id_factura = ?
            ");
            $stmt->execute([$facturaId]);
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($productos);
            break;

        case 'countInvoices':
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM facturas");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($result);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>