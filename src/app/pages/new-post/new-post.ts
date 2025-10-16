import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../services/post';
import { PropertyTypeValidator } from '../../validators/property-type.validator';
import { CreatePostRequest, CreatePostResponse } from '../../models/postModels';

@Component({
  selector: 'app-new-post',
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.html',
})
export class NewPost implements OnInit {
  postForm!: FormGroup;

  private fb = inject(FormBuilder);
  private _postService = inject(Post);
  isLoading = false;
  serverErrorMsg: any;
  postStstus:boolean=false;

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

  addNewPost() { // Require Header -> Interceptors
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.serverErrorMsg = '';

    const postData: CreatePostRequest = this.postForm.value;

    this._postService.createPost(postData).subscribe({
      next: (res: CreatePostResponse) => {
        this.postStstus = res.success;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.serverErrorMsg = 'Something went wrong. Please try again.';
      },
    });
  }
}
