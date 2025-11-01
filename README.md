# Labo08-Web

- *¿Cuál es la diferencia entre autenticación y autorizacion?*

Autenticación: Es el proceso de verificar la identidad del usuario. Por ejemplo, cuando se hace un login con email y contraseña.

Autorización: Es el proceso de verificar los permisos que tiene el usuario una vez que el sistema sabe quien es. Por ejemplo, decidir si puede acceder a una ruta protegida.

- *¿Cuál es la función del token JWT en la guía?*
  
El token JWT funciona como una credencial digital que el servidor le entrega al cliente (React) después de un login exitoso.

El cliente (React) guarda esta credencial y la presenta en cada solicitud futura al servidor (Express). El servidor usa un middleware (como verifyToken) para revisar el token y confirmar que el usuario está autenticado y autorizado para acceder al recurso solicitado.
