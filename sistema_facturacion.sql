-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-11-2024 a las 05:18:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_facturacion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `email`, `telefono`, `direccion`, `created_at`) VALUES
(1, 'Marco Serna', '123123@gmail.com', '3044265666', 'Carrera 17 #64a-236', '2024-11-07 04:24:35'),
(2, 'Juan Luis guerra', 'elver@example.com', '300123456', 'Calle falsa 123', '2024-11-07 16:31:12'),
(3, 'Brayan Angulo', 'brayan@example.com', '3013125000', 'Carrera 8 # 5-50', '2024-11-08 03:28:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_factura`
--

CREATE TABLE `detalle_factura` (
  `id_detalle` int(11) NOT NULL,
  `id_factura` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_unitario`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_factura`
--

INSERT INTO `detalle_factura` (`id_detalle`, `id_factura`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(3, 2, 2, 5, 4800.00),
(4, 2, 1, 2, 2500.00),
(5, 3, 2, 1, 4800.00),
(6, 8, 1, 2, 2500.00),
(7, 8, 2, 3, 4800.00),
(8, 8, 34, 2, 2800.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id_factura` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas`
--

INSERT INTO `facturas` (`id_factura`, `id_cliente`, `id_usuario`, `fecha`, `total`) VALUES
(2, 1, 4, '2024-11-07 05:00:00', 29000.00),
(3, 2, NULL, '2024-11-06 05:00:00', 4800.00),
(8, 3, NULL, '2024-11-07 05:00:00', 25000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_usuario`
--

CREATE TABLE `permisos_usuario` (
  `id_permiso` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `permiso` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos_usuario`
--

INSERT INTO `permisos_usuario` (`id_permiso`, `id_usuario`, `permiso`) VALUES
(1, 4, 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL CHECK (`stock` >= 0),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`, `created_at`) VALUES
(1, 'Papas Margarita', 'Papas de limón', 2500.00, 96, '2024-11-07 05:26:38'),
(2, 'Leche Alquería', 'Deslactosada', 4800.00, 91, '2024-11-07 05:37:05'),
(32, 'Manzana Roja', 'Manzanas rojas frescas y jugosas', 3000.00, 100, '2024-11-08 03:37:19'),
(33, 'Banana', 'Bananas maduras y dulces', 2500.00, 200, '2024-11-08 03:37:19'),
(34, 'Lechuga', 'Lechuga fresca para ensaladas', 2800.00, 48, '2024-11-08 03:37:19'),
(35, 'Tomate', 'Tomates maduros y sabrosos', 4000.00, 80, '2024-11-08 03:37:19'),
(36, 'Cebolla', 'Cebolla blanca para cocinar', 2000.00, 150, '2024-11-08 03:37:19'),
(37, 'Papa', 'Papas blancas para freír o cocinar', 2500.00, 250, '2024-11-08 03:37:19'),
(38, 'Leche entera', 'Leche entera pasteurizada', 4500.00, 120, '2024-11-08 03:37:19'),
(39, 'Yogurt natural', 'Yogurt natural sin azúcar', 2200.00, 80, '2024-11-08 03:37:19'),
(40, 'Queso mozzarella', 'Queso mozzarella rallado', 5000.00, 60, '2024-11-08 03:37:19'),
(41, 'Huevos', 'Huevos grandes de gallina', 5500.00, 100, '2024-11-08 03:37:19'),
(42, 'Arroz blanco', 'Arroz blanco para cocinar', 3500.00, 200, '2024-11-08 03:37:19'),
(43, 'Fideos espagueti', 'Fideos espagueti secos', 2800.00, 150, '2024-11-08 03:37:19'),
(44, 'Atún en lata', 'Atún en lata en aceite de oliva', 3000.00, 100, '2024-11-08 03:37:19'),
(45, 'Maíz en lata', 'Maíz dulce en lata', 2500.00, 80, '2024-11-08 03:37:19'),
(46, 'Frijoles negros', 'Frijoles negros enlatados', 2200.00, 60, '2024-11-08 03:37:19'),
(47, 'Pan blanco', 'Pan blanco de molde', 3000.00, 120, '2024-11-08 03:37:19'),
(48, 'Pan integral', 'Pan integral de molde', 3500.00, 80, '2024-11-08 03:37:19'),
(49, 'Galletas de chocolate', 'Galletas de chocolate con chispas', 4000.00, 100, '2024-11-08 03:37:19'),
(50, 'Jugo de naranja', 'Jugo de naranja natural', 4500.00, 150, '2024-11-08 03:37:19'),
(51, 'Agua embotellada', 'Agua mineral sin gas', 2000.00, 200, '2024-11-08 03:37:19'),
(52, 'Carne molida', 'Carne de res molida', 15000.00, 120, '2024-11-08 03:37:19'),
(53, 'Pollo entero', 'Pollo entero fresco', 25000.00, 80, '2024-11-08 03:37:19'),
(54, 'Cerdo en bistec', 'Bistec de cerdo', 18000.00, 60, '2024-11-08 03:37:19'),
(55, 'Salmón fresco', 'Salmón fresco para filetear', 40000.00, 40, '2024-11-08 03:37:19'),
(56, 'Manzanas verdes', 'Manzanas verdes Granny Smith', 3000.00, 100, '2024-11-08 03:37:19'),
(57, 'Pera', 'Peras Bartlett', 2500.00, 80, '2024-11-08 03:37:19'),
(58, 'Uvas', 'Uvas rojas sin semilla', 3000.00, 60, '2024-11-08 03:37:19'),
(59, 'Plátano maduro', 'Plátanos maduros para comer', 2000.00, 120, '2024-11-08 03:37:19'),
(60, 'Naranja', 'Naranjas Navel', 2500.00, 150, '2024-11-08 03:37:19'),
(61, 'Manzana Roja', 'Manzanas rojas frescas y jugosas', 3000.00, 100, '2024-11-08 03:39:02'),
(62, 'Banana', 'Bananas maduras y dulces', 2500.00, 200, '2024-11-08 03:39:02'),
(63, 'Lechuga', 'Lechuga fresca para ensaladas', 2800.00, 50, '2024-11-08 03:39:02'),
(64, 'Tomate', 'Tomates maduros y sabrosos', 4000.00, 80, '2024-11-08 03:39:02'),
(65, 'Cebolla', 'Cebolla blanca para cocinar', 2000.00, 150, '2024-11-08 03:39:02'),
(66, 'Papa', 'Papas blancas para freír o cocinar', 2500.00, 250, '2024-11-08 03:39:02'),
(67, 'Leche entera', 'Leche entera pasteurizada', 4500.00, 120, '2024-11-08 03:39:02'),
(68, 'Yogurt natural', 'Yogurt natural sin azúcar', 2200.00, 80, '2024-11-08 03:39:02'),
(69, 'Queso mozzarella', 'Queso mozzarella rallado', 5000.00, 60, '2024-11-08 03:39:02'),
(70, 'Huevos', 'Huevos grandes de gallina', 5500.00, 100, '2024-11-08 03:39:02'),
(71, 'Arroz blanco', 'Arroz blanco para cocinar', 3500.00, 200, '2024-11-08 03:39:02'),
(72, 'Fideos espagueti', 'Fideos espagueti secos', 2800.00, 150, '2024-11-08 03:39:02'),
(73, 'Atún en lata', 'Atún en lata en aceite de oliva', 3000.00, 100, '2024-11-08 03:39:02'),
(74, 'Maíz en lata', 'Maíz dulce en lata', 2500.00, 80, '2024-11-08 03:39:02'),
(75, 'Frijoles negros', 'Frijoles negros enlatados', 2200.00, 60, '2024-11-08 03:39:02'),
(76, 'Pan blanco', 'Pan blanco de molde', 3000.00, 120, '2024-11-08 03:39:02'),
(77, 'Pan integral', 'Pan integral de molde', 3500.00, 80, '2024-11-08 03:39:02'),
(78, 'Galletas de chocolate', 'Galletas de chocolate con chispas', 4000.00, 100, '2024-11-08 03:39:02'),
(79, 'Jugo de naranja', 'Jugo de naranja natural', 4500.00, 150, '2024-11-08 03:39:02'),
(80, 'Agua embotellada', 'Agua mineral sin gas', 2000.00, 200, '2024-11-08 03:39:02'),
(81, 'Carne molida', 'Carne de res molida', 15000.00, 120, '2024-11-08 03:39:02'),
(82, 'Pollo entero', 'Pollo entero fresco', 25000.00, 80, '2024-11-08 03:39:02'),
(83, 'Cerdo en bistec', 'Bistec de cerdo', 18000.00, 60, '2024-11-08 03:39:02'),
(84, 'Salmón fresco', 'Salmón fresco para filetear', 40000.00, 40, '2024-11-08 03:39:02'),
(85, 'Manzanas verdes', 'Manzanas verdes Granny Smith', 3000.00, 100, '2024-11-08 03:39:02'),
(86, 'Pera', 'Peras Bartlett', 2500.00, 80, '2024-11-08 03:39:02'),
(87, 'Uvas', 'Uvas rojas sin semilla', 3000.00, 60, '2024-11-08 03:39:02'),
(88, 'Plátano maduro', 'Plátanos maduros para comer', 2000.00, 120, '2024-11-08 03:39:02'),
(89, 'Naranja', 'Naranjas Navel', 2500.00, 150, '2024-11-08 03:39:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `sincronizado` tinyint(1) DEFAULT 0,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `telefono`, `sincronizado`, `password`) VALUES
(4, 'Marco Eduar', '123456@gmail.com', '3044265666', 1, '5678');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_factura` (`id_factura`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `permisos_usuario`
--
ALTER TABLE `permisos_usuario`
  ADD PRIMARY KEY (`id_permiso`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `permisos_usuario`
--
ALTER TABLE `permisos_usuario`
  MODIFY `id_permiso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD CONSTRAINT `detalle_factura_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturas` (`id_factura`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_factura_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE SET NULL,
  ADD CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `permisos_usuario`
--
ALTER TABLE `permisos_usuario`
  ADD CONSTRAINT `permisos_usuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
