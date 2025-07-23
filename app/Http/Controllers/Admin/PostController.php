<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Category;
use App\Models\Post;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $posts = Post::with(['category', 'comments.user'])
            ->withCount('comments')
            ->latest()
            ->orderBy('comments_count', 'desc')
            ->paginate(10);

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'categories' => Category::options()->get(),
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        try {
            Post::create($request->validated());

            return to_route('admin.posts.index')->with('success', 'Create post successfully');

        } catch (Exception $e) {
            Log::error('Create post fail:'.$e->getMessage());

            return to_route('admin.posts.index')->with('error', 'Create post failed');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        if (! $this->canAccess($post)) {
            return to_route('admin.posts.index')->with('error', 'Permission denied.');
        }

        try {
            $post->update($request->validated());

            return to_route('admin.posts.index')->with('error', 'Permission denied.');

        } catch (Exception $e) {
            Log::error("Update post id {$post->id} fail:".$e->getMessage());

            return to_route('admin.posts.index')->with('error', 'Update post failed.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if (! $this->canAccess($post)) {
            return to_route('admin.posts.index')->with('error', 'Permission denied.');
        }
        try {
            $post->delete();

            return to_route('admin.posts.index')->with('success', 'Delete post successfully!');
        } catch (Exception $e) {
            Log::error("Delete post {$post->id} fail with error: ".$e->getMessage());

            return to_route('admin.posts.index')->with('error', 'Delete post failed!');

        }
    }

    private function canAccess(Post $post): bool
    {
        return $post->id !== auth()->user()->id || ! auth()->user()->isAdmin();
    }
}
