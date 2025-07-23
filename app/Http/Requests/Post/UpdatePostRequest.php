<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['bail', 'required', 'string', 'min:3', 'max:255'],
            'slug' => ['bail', 'string', 'max:255', Rule::unique('posts', 'slug')->ignore($this->route('post')->id)],
            'excerpt' => ['nullable', 'string', 'max:255'],
            'content' => ['required'],
            'image' => ['bail', 'nullable', 'image', 'mimes:jpg,png,jpeg', 'max:2048'],
            'user_id' => ['exists:users,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'published_at' => ['nullable'],
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'user_id' => auth()->user()->id,
            'slug' => Str::slug($this->title),
        ]);
    }
}
