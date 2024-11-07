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
                $id_factura = $_POST['id_factura'];
                $id_producto = $_POST['id_producto'];
                $cantidad = $_POST['cantidad'];
                $precio_unitario = $_POST['precio_unitario'];

                // Verificar stock disponible
                $stmt = $pdo->prepare("SELECT stock FROM productos WHERE id_producto = ?");
                $stmt->execute([$id_producto]);
                $producto = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($producto['stock'] < $cantidad) {
                    throw new Exception('Stock insuficiente');
                }

                // Insertar detalle
                $stmt = $pdo->prepare("INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");
                $stmt->execute([$id_factura, $id_producto, $cantidad, $precio_unitario]);

                // Actualizar stock
                $stmt = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id_producto = ?");
                $stmt->execute([$cantidad, $id_producto]);

                // Actualizar total de la factura
                $stmt = $pdo->prepare("UPDATE facturas SET total = (SELECT SUM(subtotal) FROM detalle_factura WHERE id_factura = ?) WHERE id_factura = ?");
                $stmt->execute([$id_factura, $id_factura]);

                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Detalle de factura agregado con éxito.']);
            } catch (Exception $e) {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                return;
            }
            break;

        case 'update':
            $pdo->beginTransaction();
            try {
                $id = $_POST['id'];
                $cantidad = $_POST['cantidad'];
                $precio_unitario = $_POST['precio_unitario'];

                // Obtener datos actuales
                $stmt = $pdo->prepare("SELECT id_producto, cantidad as cant_actual FROM detalle_factura WHERE id_detalle = ?");
                $stmt->execute([$id]);
                $detalle_actual = $stmt->fetch(PDO::FETCH_ASSOC);

                // Verificar stock disponible para la diferencia
                $diferencia_cantidad = $cantidad - $detalle_actual['cant_actual'];
                if ($diferencia_cantidad > 0) {
                    $stmt = $pdo->prepare("SELECT stock FROM productos WHERE id_producto = ?");
                    $stmt->execute([$detalle_actual['id_producto']]);
                    $producto = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($producto['stock'] < $diferencia_cantidad) {
                        throw new Exception('Stock insuficiente');
                    }
                }

                // Actualizar detalle
                $stmt = $pdo->prepare("UPDATE detalle_factura SET cantidad = ?, precio_unitario = ? WHERE id_detalle = ?");
                $stmt->execute([$cantidad, $precio_unitario, $id]);

                // Actualizar stock
                $stmt = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id_producto = ?");
                $stmt->execute([$diferencia_cantidad, $detalle_actual['id_producto']]);

                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Detalle de factura actualizado con éxito.']);
            } catch (Exception $e) {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                return;
            }
            break;

        case 'delete':
            $pdo->beginTransaction();
            try {
                $id = $_POST['id'];

                // Obtener información del detalle antes de eliminar
                $stmt = $pdo->prepare("SELECT id_producto, cantidad FROM detalle_factura WHERE id_detalle = ?");
                $stmt->execute([$id]);
                $detalle = $stmt->fetch(PDO::FETCH_ASSOC);

                // Eliminar detalle
                $stmt = $pdo->prepare("DELETE FROM detalle_factura WHERE id_detalle = ?");
                $stmt->execute([$id]);

                // Devolver stock
                $stmt = $pdo->prepare("UPDATE productos SET stock = stock + ? WHERE id_producto = ?");
                $stmt->execute([$detalle['cantidad'], $detalle['id_producto']]);

                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'Detalle de factura eliminado con éxito.']);
            } catch (Exception $e) {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                return;
            }
            break;

        case 'fetch':
            if (isset($_POST['id'])) {
                $id = $_POST['id'];
                $stmt = $pdo->prepare("
                    SELECT df.*, p.nombre as producto_nombre 
                    FROM detalle_factura df 
                    LEFT JOIN productos p ON df.id_producto = p.id_producto 
                    WHERE df.id_detalle = ?
                ");
                $stmt->execute([$id]);
                $detalle = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($detalle);
            } else {
                $id_factura = $_POST['id_factura'] ?? null;
                $query = "
                    SELECT df.*, p.nombre as producto_nombre 
                    FROM detalle_factura df 
                    LEFT JOIN productos p ON df.id_producto = p.id_producto
                ";
                if ($id_factura) {
                    $query .= " WHERE df.id_factura = ?";
                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$id_factura]);
                } else {
                    $stmt = $pdo->query($query);
                }
                $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($detalles);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}