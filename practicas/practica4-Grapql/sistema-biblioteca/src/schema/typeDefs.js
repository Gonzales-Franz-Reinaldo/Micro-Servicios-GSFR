export const typeDefs = `#graphql
  type Libro {
    id: ID!
    titulo: String!
    autor: String!
    isbn: String!
    anio_publicacion: Int!
    prestamos: [Prestamo]
  }

  type Prestamo {
    id: ID!
    usuario: String!
    fecha_prestamo: String!
    fecha_devolucion: String!
    libro: Libro!
  }

  input LibroInput {
    titulo: String!
    autor: String!
    isbn: String!
    anio_publicacion: Int!
  }

  input PrestamoInput {
    usuario: String!
    fecha_prestamo: String!
    fecha_devolucion: String!
    libroId: ID!
  }

  type Query {
    getLibros: [Libro]
    getPrestamos: [Prestamo]
    getPrestamoById(id: ID!): Prestamo
    getPrestamosByUsuario(usuario: String!): [Prestamo]  # Extra challenge
  }

  type Mutation {
    createLibro(input: LibroInput!): Libro
    createPrestamo(input: PrestamoInput!): Prestamo
  }
`;