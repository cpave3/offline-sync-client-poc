import { Model, Query, Relation } from "@nozbe/watermelondb"
import { Associations } from "@nozbe/watermelondb/Model"
import { relation, immutableRelation, text, children, writer } from '@nozbe/watermelondb/decorators'
import Post from "./Post"
import Task from "./Task"
import Room from "./Room"

export default class TaskInspection extends Model {
    static table = 'task_inspections'
    static associations: Associations = {
      tasks: { type: 'belongs_to', key: 'task_id' },
      rooms: { type: 'has_many', foreignKey: 'inspection_id' },
    }

    @text('agreement_end_date') agreementEndDate: string

    @relation('tasks', 'task_id') task: Relation<Task>
    @children('rooms') rooms: Query<Room>

      // writer function to add comment
    @writer async addRoom(title: string) {
      const room = await this.collections.get<Room>('rooms').create((room) => {
        room.inspection.set(this)
        room.title = title
      })
      return room;
    }
  }