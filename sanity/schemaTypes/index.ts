import { type SchemaTypeDefinition } from 'sanity'
import { localeString } from './localeString'
import { introSection } from './introSection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [localeString, introSection],
}
