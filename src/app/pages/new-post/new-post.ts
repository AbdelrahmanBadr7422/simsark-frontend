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
      address: ['', Validators.required],
    });
  }
  selectedFiles: File[] = [];

  onImageSelect(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const imageUrls: string[] = [...this.previewImages]; // keep previous previews

    Array.from(files).forEach((file) => {
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target.result) {
          const imageUrl = e.target.result as string;
          this.previewImages.push(imageUrl);
          imageUrls.push(imageUrl);
          this.postForm.patchValue({ images: [...imageUrls] });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value to allow reselecting same files
    event.target.value = '';
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.postForm.patchValue({ images: [...this.previewImages] });
  }

  clearImages() {
    this.previewImages = [];
    this.selectedFiles = [];
    this.postForm.patchValue({ images: [] });
  }

  addNewPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.serverErrorMsg = '';
    this.successMessage = '';

    const formData = new FormData();
    const form = this.postForm.value;

    // append text fields
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('propertyType', form.propertyType);
    formData.append('price', form.price);
    formData.append('area', form.area);
    formData.append('rooms', form.rooms);
    formData.append('bathrooms', form.bathrooms);
    formData.append('address', form.address);

    // append real image files
    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    this.postService.createPost(formData).subscribe({
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
