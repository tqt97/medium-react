<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Log;
use Throwable;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = Category::withCount('posts')
            ->latest()
            ->paginate(5);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        try {
            Category::create($request->validated());

            return redirect()->route('admin.categories.index')->with('success', 'Category has been created successfully!');
        } catch (Throwable $th) {
            Log::error($th);

            return redirect()->route('admin.categories.index')->with('error', 'Something went wrong');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        try {
            $category->update($request->validated());

            $redirectParams = [];
            $page = $request->query('page');

            if ($page && intval($page) > 1) {
                $redirectParams['page'] = $page;
            }

            return redirect()->route('admin.categories.index', $redirectParams)
                ->with('success', 'Category has been updated successfully!');
        } catch (Throwable $th) {
            Log::error($th);

            return redirect()->route('admin.categories.index')->with('error', 'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        // TODO
        // if (! $this->canDeleteCategory($category)) {
        //     return redirect()->route('admin.categories.index')->with('error', 'You are not allowed to delete this category');
        // }

        try {
            $category->delete();

            return redirect()->route('admin.categories.index')->with('success', 'Category has been deleted');
        } catch (Throwable $th) {
            Log::error($th);

            return redirect()->route('admin.categories.index')->with('error', 'Something went wrong');
        }
    }

    private function canDeleteCategory(Category $category): bool
    {
        return auth()->user()->role === UserRole::ADMIN->value && $category->posts()->count() === 0;
    }
}
