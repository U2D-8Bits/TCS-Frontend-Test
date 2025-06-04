# TcsApp

Este proyecto es una aplicación Angular para la gestión de productos financieros. Permite listar, buscar, agregar, editar y eliminar productos, utilizando una arquitectura modular y componentes reutilizables.

## Estructura del Proyecto

- **src/app/core**: Modelos y servicios principales (por ejemplo, `ProductService` y el modelo `Product`).
- **src/app/features**: Funcionalidades principales de la app. Actualmente incluye:
  - **product**: Componente principal para la gestión de productos (`ProductComponent`).
- **src/app/shared**: Componentes reutilizables y servicios auxiliares:
  - **components**: Botones, formularios, inputs personalizados y modales.
  - **services**: Servicio de modales para notificaciones y confirmaciones.

## Funcionalidades principales

- **Listado de productos**: Visualización paginada y búsqueda por nombre.
- **Agregar producto**: Formulario con validaciones (ID único, fechas, etc.).
- **Editar producto**: Modificación de datos existentes.
- **Eliminar producto**: Confirmación mediante modal.
- **Componentes personalizados**: Inputs, botones, formularios y modales reutilizables.
- **Feedback visual**: Skeletons de carga y notificaciones.

## Desarrollo y pruebas

### Servidor de desarrollo

```bash
ng serve
```

Abre `http://localhost:4200/` en tu navegador. La app recargará automáticamente al guardar cambios.

### Construcción

```bash
ng build
```

Los artefactos se generan en la carpeta `dist/`.

### Pruebas unitarias

```bash
ng test
```

### Estructura de carpetas relevante

```
src/
  app/
    core/
      models/           # Modelos de datos (Product, etc)
      services/         # Servicios (ProductService)
    features/
      product/          # Componente principal de productos
    shared/
      components/       # Botones, formularios, inputs, modales
      services/         # Servicio de modal
```

## Notas adicionales

- El proyecto utiliza Angular Standalone Components.
- El formulario de productos incluye validaciones asincrónicas y reglas de negocio (fechas, unicidad de ID, etc).
- El servicio de productos (`ProductService`) centraliza la comunicación con la API.
- El servicio de modal (`ModalService`) gestiona confirmaciones, alertas y notificaciones tipo toast.

Para más información sobre Angular CLI, visita la [documentación oficial](https://angular.dev/tools/cli).
