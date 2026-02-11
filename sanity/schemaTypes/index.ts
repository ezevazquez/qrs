import { type SchemaTypeDefinition } from 'sanity'
import document from './document'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [document],
}
