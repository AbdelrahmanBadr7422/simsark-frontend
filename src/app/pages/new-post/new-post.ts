import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../services/post';
import { PropertyTypeValidator } from '../../validators/property-type.validator';
import { CreatePostRequest, CreatePostResponse } from '../../models/postModels';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.html',
})
export class NewPost implements OnInit {
  postForm!: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private _postService = inject(Post);

  isLoading = false;
  serverErrorMsg: any;
  postStstus: boolean = false;
  successMessage: string = '';

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      propertyType: ['', [Validators.required, PropertyTypeValidator()]],
      price: ['', [Validators.required]],
      area: ['', [Validators.required]],
      rooms: ['', [Validators.required]],
      bathrooms: ['', [Validators.required]],
      images: [''],
    });
  }

  addNewPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.serverErrorMsg = '';

    const postData: CreatePostRequest = {
      ...this.postForm.value,
      area: parseInt(this.postForm.get('area')?.value),
      rooms: parseInt(this.postForm.get('rooms')?.value),
      bathrooms: parseInt(this.postForm.get('bathrooms')?.value),
      images: Array(this.postForm.get('images')?.value),
    };

    this._postService.createPost(postData).subscribe({
      next: (res: CreatePostResponse) => {
        this.isLoading = false;
        this.postStstus = res.success;

        if (res.success) {
          this.successMessage = 'Post created successfully! Redirecting...';
          this.postForm.reset();

          setTimeout(() => {
            this.router.navigate(['/explore']);
          }, 2000);
        }
      },
      error: () => {
        this.isLoading = false;
        this.serverErrorMsg = 'Something went wrong. Please try again.';
      },
    });
  }
}
