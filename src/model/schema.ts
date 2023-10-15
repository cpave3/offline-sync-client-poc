// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string', isOptional: true },
        { name: 'body', type: 'string' },
        { name: 'is_pinned', type: 'boolean' },
      ]
    }),
    tableSchema({
      name: 'comments',
      columns: [
        { name: 'body', type: 'string' },
        { name: 'post_id', type: 'string', isIndexed: true },
      ]
    }),
    tableSchema({
      name: 'tasks',
      columns: [
        {
          name: 'summary', type: 'string',
        },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'task_type_id', type: 'string' },
        // { name: 'taskable_id', type: 'string', isIndexed: true },
      ]
    }),
    tableSchema({
      name: 'task_inspections',
      columns: [
        { name: 'agreement_end_date', type: 'string' },
        { name: 'task_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'rooms',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'inspection_id', type: 'string', isIndexed: true }, // contrived, this isn't how the relationship would actually be...
      ],
    }),
  ]
})