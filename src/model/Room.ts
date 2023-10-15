// model/Post.js
import { Model, Query, Relation } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { field, text, date, children, writer, relation } from '@nozbe/watermelondb/decorators'
import Comment from './Comment'
import TaskInspection from './TaskInspection'

export default class Room extends Model {
  static table = 'rooms'
  static associations: Associations = {
    comments: { type: 'belongs_to', key: 'inspection_id' },
  }

  @text('name') title: string
  @relation('task_inspections', 'inspection_id') inspection: Relation<TaskInspection>

}