import { type SchemaTypeDefinition } from 'sanity'
import { localeString } from './localeString'
import { introSection } from './introSection'
import { vntSpaces } from './vntSpaces'
import { localeText } from './localeText'
import { event } from './event'
import { collaborateSection } from './collaborateSection'
import { foundersSection } from './foundersSection'
import { siteFooter } from './siteFooter'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [localeString, localeText, introSection, vntSpaces, event, collaborateSection, foundersSection, siteFooter],
}
