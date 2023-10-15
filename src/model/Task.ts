// model/Post.js
import { Model, Q, Query } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { field, text, date, children, writer, lazy } from '@nozbe/watermelondb/decorators'
import Comment from './Comment'
import TaskInspection from './TaskInspection'

export default class Task extends Model {
  static table = 'tasks'
  static associations: Associations = {
    // comments: { type: 'has', foreignKey: 'post_id' },
  }

  @text('summary') summary: string
  @text('description') description: string

  // @lazy
  // _currentUserQuery: Query<User> = this.collections
  //   .get(Tables.users)
  //   .query(Q.where(Columns.users.isMe, true))

  // @lazy
  // currentUser: Observable<User> = this._currentUserQuery.observe().pipe(
  //   switchMap(([user]) => {
  //     invariant(user, `No user marked as isMe=true found`)
  //     return user.observe()
  //   }),
  // )

  @lazy
  taskInspectionQuery: Query<TaskInspection> = this.collections
    .get('task_inspections')
    .query(Q.where('task_id', this.id), Q.take(1))

}