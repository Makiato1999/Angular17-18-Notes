import { Component } from '@angular/core';

import { PostService } from '../post.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Post } from '../post';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  id!: number;
  post!: Post;

  constructor(public postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];

    this.postService.findById(this.id).subscribe((post: Post) => {
      this.post = post;
      console.log(this.post);
    })
  }
}
