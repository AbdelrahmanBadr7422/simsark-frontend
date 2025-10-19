import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../services/post';
import { PropertyTypeValidator } from '../../validators/property-type.validator';
import { CreatePostRequest, CreatePostResponse } from '../../models/postModels';

declare const google: any;

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.html',
})
export class NewPost implements OnInit, AfterViewInit {
  postForm!: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private _postService = inject(Post);

  isLoading = false;
  serverErrorMsg: string = '';
  postStstus = false;
  successMessage = '';
  previewImages: string[] = [];

  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]],
      propertyType: ['', [Validators.required, PropertyTypeValidator()]],
      price: ['', [Validators.required]],
      area: ['', [Validators.required]],
      rooms: ['', [Validators.required]],
      bathrooms: ['', [Validators.required]],
      images: [''],
    });
  }

  ngAfterViewInit() {
    if (this.addressInput) {
      const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.postForm.patchValue({
          address: place.formatted_address,
        });
      });
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.height = `${scrollPercent}%`;
    }
  }

  onImageSelect(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

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

    const postData: CreatePostRequest = {
      ...this.postForm.value,
      area: parseInt(this.postForm.get('area')?.value),
      rooms: parseInt(this.postForm.get('rooms')?.value),
      bathrooms: parseInt(this.postForm.get('bathrooms')?.value),
    };

    this._postService.createPost(postData).subscribe({
      next: (res: CreatePostResponse) => {
        this.isLoading = false;
        this.postStstus = res.success;

        if (res.success) {
          this.successMessage = 'Post created successfully! Redirecting...';
          this.postForm.reset();
          this.previewImages = [];

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
