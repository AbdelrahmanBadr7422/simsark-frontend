import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../services/post';
import { PropertyTypeValidator } from '../../validators/property-type.validator';
import { CreatePostRequest, CreatePostResponse } from '../../models/postModels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-post.html',
})
export class NewPost implements OnInit {
  postForm!: FormGroup;
  isLoading = false;
  serverErrorMsg = '';
  successMessage = '';
  previewImages: string[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private postService = inject(Post);

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      // address: ['',],
      propertyType: ['', [Validators.required, PropertyTypeValidator()]],
      price: ['', [Validators.required, Validators.min(1)]],
      area: ['', [Validators.required, Validators.min(1)]],
      rooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      images: [''],
    });
  }

  onImageSelect(event: any) {
    const files = event.target.files;
    if (!files?.length) return;

    this.previewImages = [];
    const imageUrls: string[] = [];

    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImages.push(e.target.result);
        imageUrls.push(e.target.result);
        this.postForm.patchValue({ images: imageUrls });
      };
      reader.readAsDataURL(file);
    }
  }

  addNewPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.serverErrorMsg = '';
    this.successMessage = '';

    const form = this.postForm.value;
    const postData: CreatePostRequest = {
      ...form,
      area: +form.area,
      rooms: +form.rooms,
      bathrooms: +form.bathrooms,
      images: this.previewImages,
    };

    this.postService.createPost(postData).subscribe({
      next: (res: CreatePostResponse) => {
        this.isLoading = false;
        this.successMessage = 'Post created successfully! Redirecting...';
        this.postForm.reset();
        this.previewImages = [];
        setTimeout(() => this.router.navigate(['/explore']), 1000);
      },
      error: () => {
        this.isLoading = false;
        this.serverErrorMsg = 'Something went wrong. Please try again.';
      },
    });
  }

  getFieldError(controlName: string): string | null {
    const control = this.postForm.get(controlName);
    if (!control || !control.touched || !control.errors) return null;

    const errors = control.errors;
    if (errors['required']) return 'This field is required.';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}.`;
    if (errors['min']) return `Value must be at least ${errors['min'].min}.`;
    if (errors['invalidPropertyType']) return 'Invalid property type.';
    return null;
  }
}
