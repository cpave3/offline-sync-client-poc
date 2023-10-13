// model/Post.js
import { Model, Query } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { field, text, date, children } from '@nozbe/watermelondb/decorators'
import Comment from './Comment'

export default class Post extends Model {
  static table = 'posts'
  static associations: Associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
  }

  @text('title') title: string
  @text('body') body: string
  @field('is_pinned') isPinned: boolean
  @date('last_event_at') lastEventAt: Date
  @date('archived_at') archivedAt: Date

  @children('comments') comments: Query<Comment>

  // derived field
  get isRecentlyArchived() {
    return this.archivedAt && this.archivedAt.getTime() > Date.now() - 7 * 24 * 3600 * 1000;
  }
}