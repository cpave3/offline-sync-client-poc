// model/Post.js
import { Model, Query } from '@nozbe/watermelondb'
import { Associations } from '@nozbe/watermelondb/Model'
import { field, text, date, children, writer } from '@nozbe/watermelondb/decorators'
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


  // writer function to add comment
  @writer async addComment(body: string) {
    const comment = await this.collections.get('comments').create((comment) => {
      comment.post.set(this)
      comment.body = body
    })
    return comment;
  }

  // derived field
  get isRecentlyArchived() {
    return this.archivedAt && this.archivedAt.getTime() > Date.now() - 7 * 24 * 3600 * 1000;
  }
}