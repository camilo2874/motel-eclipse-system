# Instrucciones para Copilot - Sistema de Gestión Motel Eclipse

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexto del Proyecto
Este es un sistema de gestión para el Motel Eclipse desarrollado con React y Vite. El sistema reemplaza el manejo manual en papel con una solución digital.

## Funcionalidades Principales
- **Gestión de Habitaciones**: Control de disponibilidad, limpieza y estado
- **Registro de Huéspedes**: Check-in/check-out, datos personales
- **Control de Turnos**: Manejo de personal y horarios
- **Facturación**: Cálculo de costos por hora, consumo adicional
- **Reportes Diarios**: Planillas digitales basadas en el formato actual en papel

## Estructura de Datos Clave
- **Habitación**: número, tipo, estado (ocupada/libre/limpieza), precio por hora
- **Huésped**: datos personales, hora de ingreso/salida, habitación asignada
- **Turno**: personal, hora inicio/fin, caja anterior/actual
- **Factura**: detalle de servicios, tiempo de estadía, consumos adicionales

## Estilo y UI
- Interfaz limpia y profesional
- Colores corporativos del motel
- Diseño responsive para diferentes dispositivos
- Fácil navegación para personal con diferentes niveles técnicos

## Consideraciones Técnicas
- Usar React hooks para estado local
- Implementar localStorage para persistencia básica
- Validación de formularios
- Formato de fechas y horarios en español (Colombia)
- Cálculos automáticos de tarifas
