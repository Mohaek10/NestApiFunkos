db.createUser({
  user: 'moha',
  pwd: 'Moha123',
  roles: [
    {
      role: 'readWrite',
      db: 'funkos',
    },
  ],
})

db = db.getSiblingDB('funkos')

db.createCollection('pedidos')

db.pedidos.insertMany([
  {
    _id: ObjectId('6536518de9b0d305f193b5ef'),
    idUsuario: 123,
    cliente: {
      nombre: 'NombreCliente',
      apellido: 'ApellidoCliente',
      telefono: '123456789',
      email: 'cliente@email.com',
      direccion: {
        calle: 'CallePrincipal',
        numero: '123',
        ciudad: 'CiudadCliente',
        provincia: 'ProvinciaCliente',
        pais: 'PaisCliente',
        codigoPostal: '12345',
      },
    },
    lineasPedido: [
      {
        idFunko: 1,
        precioFunko: 20.5,
        cantidad: 2,
        total: 41.0,
      },
      {
        idFunko: 2,
        precioFunko: 15.75,
        cantidad: 3,
        total: 47.25,
      },
    ],
    createdAt: '2023-10-23T12:57:17.3411925',
    updatedAt: '2023-10-23T12:57:17.3411925',
    isDeleted: false,
    totalItems: 3,
    total: 51.97,
  },
])
