-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-08-2023 a las 14:57:06
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cotizador`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `mail` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `rol` varchar(30) NOT NULL,
  `address` varchar(30) NOT NULL,
  `postal` varchar(30) NOT NULL,
  `state` varchar(30) NOT NULL,
  `perfil` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id`, `mail`, `password`, `phone`, `rol`, `address`, `postal`, `state`, `perfil`) VALUES
(3, 'admin@admin.com', '$2b$08$cz1UZX6QHVM4RHEXGRdk5Om92gPNJNqNjlwCzzE5tiGVzbdmb2UNC', '313131313', 'admin', '', '', '', 'image-1682106916110.png'),
(35, 'mercadeo@acemar.co', '$2b$08$3dWzSjkieH2uG44NouA.C.euMRIPcSUoyX2WA0P9SJEZkUWDpkPhe', '3421', 'client', 'vddf', '541234', 'fgsdf', 'image-1691070436175.jpg'),
(36, 'mercadeo@acemar.co', '$2b$08$Jf25UXqgCSPw2sRNxwavf.pBgeWFqcsx44WnPsB84lJzjPMI3./US', '3421', 'client', 'vddf', '541234', 'fgsdf', 'image-1691070436361.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigo`
--

CREATE TABLE `codigo` (
  `id` int(11) NOT NULL,
  `inicial` varchar(30) NOT NULL,
  `marco` varchar(30) NOT NULL,
  `color` varchar(30) NOT NULL,
  `finish` varchar(30) NOT NULL,
  `kerfs` varchar(30) NOT NULL,
  `core` varchar(30) NOT NULL,
  `veneer` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `codigo`
--

INSERT INTO `codigo` (`id`, `inicial`, `marco`, `color`, `finish`, `kerfs`, `core`, `veneer`) VALUES
(1, 'UN', 'XD', 'false', 'false', 'false', 'true', 'false'),
(2, 'UN', 'XD', 'false', 'false', 'false', 'true', 'false'),
(3, 'PD', 'XD', 'false', 'false', 'false', 'false', 'false'),
(4, 'HL', 'RA', 'false', 'false', 'true', 'false', 'false'),
(5, 'PD', 'RA', 'false', 'false', 'false', 'false', 'false'),
(6, 'l', 'RA', 'true', 'true', 'false', 'false', 'false'),
(7, 'PU', 'RA', 'false', 'false', 'true', 'false', 'true'),
(8, 'L', 'XD', 'true', 'true', 'false', 'false', 'false'),
(9, 'LM', 'XD', 'true', 'false', 'true', 'false', 'false'),
(10, 'PU', 'XD', 'false', 'false', 'true', 'false', 'false'),
(11, 'L', 'XD', 'true', 'true', 'false', 'false', 'false'),
(12, 'LM', 'XD', 'true', 'false', 'false', 'false', 'false'),
(13, 'L', 'XD', 'true', 'false', 'false', 'false', 'false'),
(14, 'LM', 'XD', 'true', 'false', 'false', 'false', 'false'),
(15, 'L', 'XD', 'true', 'true', 'false', 'false', 'false'),
(16, 'PU', 'XD', 'false', 'false', 'false', 'false', 'true');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encabezadofac`
--

CREATE TABLE `encabezadofac` (
  `id_enc` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_piso` int(11) NOT NULL,
  `codigo` varchar(30) NOT NULL,
  `imagen` varchar(60) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` float NOT NULL,
  `layer` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `encabezadofac`
--

INSERT INTO `encabezadofac` (`id_enc`, `id_cliente`, `id_piso`, `codigo`, `imagen`, `cantidad`, `precio`, `layer`) VALUES
(449, 35, 1, 'E-15-10-MA', 'Bercy-Hardwood-Flooring-Acemar.jpg', 1, 1111, '1.5'),
(449, 35, 2, 'E-3-14-MQ', 'Botzaris-Hardwood-Flooring-Accemar.jpg', 1, 4.64, '3'),
(449, 35, 3, 'F-3-16-MQ', 'Charonne.jpg', 1, 88, '3'),
(1, 35, 8, 'E-3-12-MQ', 'Praia.jpg', 1, 9999, '3'),
(1, 35, 3, 'F-3-16-MQ', 'Charonne.jpg', 1, 88, '3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` int(11) NOT NULL,
  `id_encabezado` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `total` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `factura`
--

INSERT INTO `factura` (`id_factura`, `id_encabezado`, `id_cliente`, `total`) VALUES
(449, 449, 35, 1203.64),
(452, 5000, 35, 1),
(453, 5000, 35, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pisos`
--

CREATE TABLE `pisos` (
  `id` int(11) NOT NULL,
  `producto` varchar(30) NOT NULL,
  `imgpiso` varchar(60) NOT NULL,
  `cod1` varchar(30) NOT NULL,
  `cod3` varchar(30) NOT NULL,
  `inventario` int(11) NOT NULL,
  `inventario3` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pisos`
--

INSERT INTO `pisos` (`id`, `producto`, `imgpiso`, `cod1`, `cod3`, `inventario`, `inventario3`) VALUES
(1, 'Bercy Hardwood Flooring', 'Bercy-Hardwood-Flooring-Acemar.jpg', 'E-15-10-MA', 'E-3-10-MQ', 3, 2),
(2, 'Botzaris Hardwood Flooring', 'Botzaris-Hardwood-Flooring-Accemar.jpg', 'E-15-14-MQ', 'E-3-14-MQ', 2, 24),
(3, 'Charone Hardwood Flooring', 'Charonne.jpg', 'F-15-16-MA', 'F-3-16-MQ', 0, 35),
(5, 'Light Pale Hardwood Flooring', 'Light-Pale.JPG', 'F-15-07-MA', 'F-3-07-MQ', 31, 41),
(6, 'Mont Martre Hardwood Flooring', 'Mont-Martre.jpg', 'F-15-15-MA', 'F-3-15-MQ', 54, 43),
(7, 'Pale White Hardwood Flooring', 'Pale-White.JPG', 'F-15-01-MA', 'F-3-01-MQ', 35, 41),
(8, 'Praia Hardwood Flooring', 'Praia.jpg', 'E-15-12-MQ', 'E-3-12-MQ', 5, 27),
(9, 'Roseaux Hardwood Flooring', 'Roseaux.JPG', 'F-15-11-MA', 'F-3-11-MQ', 33, 42),
(10, 'White Pearl Hardwood Flooring', 'White-Pearl.JPG', 'F-15-08-MA', 'F-3-08-MQ', 55, 44);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pisosprec`
--

CREATE TABLE `pisosprec` (
  `idcliente` int(11) NOT NULL,
  `idpisos` int(11) NOT NULL,
  `layer1` float NOT NULL,
  `layer3` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pisosprec`
--

INSERT INTO `pisosprec` (`idcliente`, `idpisos`, `layer1`, `layer3`) VALUES
(3, 2, 3.18, 4.64),
(3, 8, 8888, 9999),
(3, 3, 88, 88),
(3, 5, 99, 99),
(3, 6, 0, 0),
(3, 7, 11, 11),
(3, 9, 11, 11),
(3, 1, 1111, 111),
(3, 10, 3212, 3123),
(35, 2, 3.18, 4.64),
(35, 8, 8888, 9999),
(35, 3, 88, 88),
(35, 5, 99, 99),
(35, 6, 0, 0),
(35, 7, 11, 11),
(35, 9, 11, 11),
(35, 1, 1111, 111),
(35, 10, 3212, 3123),
(36, 2, 3.18, 4.64),
(36, 8, 8888, 9999),
(36, 3, 88, 88),
(36, 5, 99, 99),
(36, 6, 0, 0),
(36, 7, 11, 11),
(36, 9, 11, 11),
(36, 1, 1111, 111),
(36, 10, 3212, 3123);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puertas`
--

CREATE TABLE `puertas` (
  `id` int(11) NOT NULL,
  `producto` varchar(50) NOT NULL,
  `directorio` varchar(60) NOT NULL,
  `imgpuerta` varchar(125) NOT NULL,
  `imgmarco` varchar(125) NOT NULL,
  `finish` varchar(30) NOT NULL,
  `conmarco` float NOT NULL,
  `sinmarco` float NOT NULL,
  `conhigth` float NOT NULL,
  `sinhight` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `puertas`
--

INSERT INTO `puertas` (`id`, `producto`, `directorio`, `imgpuerta`, `imgmarco`, `finish`, `conmarco`, `sinmarco`, `conhigth`, `sinhight`) VALUES
(1, 'Unfinished Basic', 'Unfinished-Basic', 'Unfinished-Basic.jpg', 'marco-d.jpg', 'mdf', 222.43, 107.72, 246.04, 131.33),
(2, 'Unfinished Basic Frameless', 'Unfinished-Basic', 'Unfinished-Basic-Frameless.jpg', 'marco-g.jpg', 'mdf', 246.04, 114.71, 260.38, 145.67),
(3, 'Primed White solid', 'Primed-White-Solid-UV', 'Primed-White-Solid-UV.jpg', 'marco-d.jpg', 'prime', 159, 159, 0, 0),
(4, 'HPL Frameless Door', 'HPL', '102.jpg', 'marco-g.jpg', 'HPL', 484, 129, 0, 0),
(5, 'White Solid Frameless Primed', 'White-Solid-Frameless-Primed', 'White-Solid-Frameless-Primed.jpg', 'marco-g.jpg', 'Prime', 233, 233, 0, 0),
(6, 'Solid Frameless Lacquered', 'Solid-Frameless-Lacquered', 'HM1.jpg', 'marco-g.jpg', 'Matt', 340, 340, 340, 340),
(7, 'Engineered Frameless Door', 'Engineered-frameless-door', '-40.jpg', 'marco-g.jpg', 'solid', 484, 355, 0, 0),
(8, 'Solid Plain Lacquered Door', 'Lacquered-Plain', 'HM1.jpg', 'marco-d.jpg', 'higth gloss', 351.52, 200.3, 371.52, 220.3),
(9, '9K Solid Lacquered Door', '9K', 'M1.jpg', 'marco-d.jpg', 'matt', 558.55, 399, 0, 0),
(10, 'Ultragreen Door', 'Puertas-Ultragreen', '200.jpg', 'marco-d.jpg', 'As Sample', 283.4, 154.4, 0, 0),
(11, '4K Solid Lacquered Door', '4K', 'HG1.jpg', 'marco-d.jpg', 'matt', 366.52, 215.3, 417.08, 235.3),
(12, '5K Solid Lacquered Door', '5K', 'G1.jpg', 'marco-d.jpg', 'Matt Lacquered', 558.55, 399, 0, 0),
(13, '6B Louvered Solid Lacquered', '6B', 'MG1.jpg', 'marco-d.jpg', 'Matt & High Gloss Lacquered', 410.22, 259, 463.11, 281.33),
(14, '6K Solid Lacquered Door', '6K', 'G1.jpg', 'marco-d.jpg', 'Matt', 341, 341, 341, 341),
(15, '6A Louvered Solid Lacquered', '6A', 'HM1.jpg', 'marco-d.jpg', 'Matt & High Gloss Lacquered', 376.31, 225.09, 426.78, 245),
(16, 'RPH Louvered Veneer Door', 'Louvered-RPH-Veneer', '-10.jpg', 'marco-d.jpg', 'Solid', 279.68, 279.68, 0, 0),
(17, 'Solid Lacquered Series 7K', 'Lacquered-series-7k', 'White-Grey-Solid-Lacquered-7K.png', '', 'Matt', 340, 340, 340, 340),
(18, 'Solid Lacquered Series 13K', 'Solid-Lacquered-Series-13K', 'White-Grey-Solid-Lacquered-Series-13K.png', '', 'Matt', 340, 340, 340, 340),
(19, 'Solid Lacquered Series', 'Solid-Lacquered-Series', 'White-Solid-Primed-Series.png', '', 'Matt', 253, 253, 253, 253),
(20, 'Veneered Frontino Series W', 'Veneered-Frontino-Series-W', 'Veneered-Frontino-Series-W.png', '', 'Veneered', 279, 279, 279, 279),
(21, 'Veneered Frontino Series 4W', 'Veneered-Frontino-Series-4W', 'Veneered-Frontino-Series-4W.png', '', ' Veneered', 399, 399, 399, 399),
(22, 'Veneered Frontino Series EOV3', 'Veneered-Frontino-Series-EOV3', 'Veneered-Frontino-Series-EOV3.png', '', 'Veneered', 278, 278, 278, 278),
(23, 'Veneered Frontino Series KO', 'Veneered-Frontino-Series-KO', 'Veneered-Frontino-Series-KO.png', '', 'Veneered', 322.05, 322.05, 322.05, 322.05),
(24, 'Veneered Frontino Series EOWZ', 'Veneered-Frontino-Series-EOWZ', 'Veneered-Frontino-Series-EOWZ.png', '', 'Veneered', 424, 424, 424, 424),
(25, 'Veneered Frontino Series EOMV', 'Veneered-Frontino-Series-EOMV', 'Veneered-Frontino-Series-EOMV.png', '', 'Veneered', 383, 383, 383, 383),
(26, 'Veneered Frontino Series OH4I', 'Veneered-Frontino-Series-OH4I', 'Veneered-Frontino-Series-OH4I.png', '', 'Veneered', 434, 434, 434, 434),
(27, 'Veneered Frontino Series WV', 'Veneered-Frontino-Series-WV', 'Veneered-Frontino-Series-WV.png', '', 'Veneered', 520, 520, 520, 520),
(28, 'Veneered Frontino Series R', 'Veneered-Frontino-Series-R', 'Veneered-Frontino-Series-R.png', '', 'Veneered', 332, 332, 332, 332),
(29, 'HPL Frontino Series', 'HPL-Frontino-Series', 'HPL-Frontino-Series.png', '', 'HPL', 346, 346, 346, 346),
(30, 'Louvered Series', 'Louvered-Series', 'Louvered-Series.png', '', 'Matt', 310, 310, 310, 310),
(31, 'Belmira Series 6G', 'Belmira-Series-6G', 'Belmira-Series-6G.png', '', 'Matt', 561, 561, 561, 561),
(32, 'Belmira Series 3G', 'Belmira-Series-3G', 'Belmira-Series-3G.png', '', 'Matt', 561, 561, 561, 561),
(33, 'Veneered Belmira Series', 'Veneered-Belmira-Series', 'Veneered-Belmira-Series.png', '', 'Veneered', 362, 362, 362, 362),
(34, 'Veneered Belmira Series 7GH', 'Veneered-Belmira-Series-7GH', 'Veneered-Belmira-Series-7GH.png', '', 'Veneered', 450, 450, 450, 450),
(35, 'Fire-Rated Wooden Door RF AC 20', 'Fire-Rated-Wooden-Door-RF-AC-20', 'Fire-Rated-Wooden-Door-RF-AC-20.png', '', 'Veneered', 383, 383, 383, 383);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `codigo`
--
ALTER TABLE `codigo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indices de la tabla `encabezadofac`
--
ALTER TABLE `encabezadofac`
  ADD KEY `id_enc` (`id_enc`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id_factura`);

--
-- Indices de la tabla `pisos`
--
ALTER TABLE `pisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pisosprec`
--
ALTER TABLE `pisosprec`
  ADD KEY `idcliente` (`idcliente`),
  ADD KEY `idpisos` (`idpisos`);

--
-- Indices de la tabla `puertas`
--
ALTER TABLE `puertas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `encabezadofac`
--
ALTER TABLE `encabezadofac`
  MODIFY `id_enc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=451;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=454;

--
-- AUTO_INCREMENT de la tabla `pisos`
--
ALTER TABLE `pisos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `puertas`
--
ALTER TABLE `puertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `codigo`
--
ALTER TABLE `codigo`
  ADD CONSTRAINT `codigo_ibfk_1` FOREIGN KEY (`id`) REFERENCES `puertas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pisosprec`
--
ALTER TABLE `pisosprec`
  ADD CONSTRAINT `pisosprec_ibfk_2` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pisosprec_ibfk_3` FOREIGN KEY (`idpisos`) REFERENCES `pisos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
