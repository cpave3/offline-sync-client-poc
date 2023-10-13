import { Model, Relation } from "@nozbe/watermelondb"
import { Associations } from "@nozbe/watermelondb/Model"
import { relation, immutableRelation, text } from '@nozbe/watermelondb/decorators'
import Post from "./Post"

export default class Comment extends Model {
    static table = 'comments'
    static associations: Associations = {
      posts: { type: 'belongs_to', key: 'post_id' },
    }

    @text('body') body: string

    @relation('posts', 'post_id') post: Relation<Post>
  }