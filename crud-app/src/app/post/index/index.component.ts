import { Component } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  posts: Post[] = [];

  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.postService.findAll().subscribe((allPosts: Post[]) => {
      this.posts = allPosts;
      console.log(this.posts);
    })
  }

  deletePost(id: number) {
    this.postService.delete(id).subscribe(() => {
      this.posts = this.posts.filter(item => item.id !== id);
      console.log('Post deleted sucessfully!');
    })
  }
}
