'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { getFirebaseServices } from '@/lib/firebase/config';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/components/ui/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const services = getFirebaseServices();
    if (!services) return;

    const snapshot = await services.db.collection('blog_categories').get();
    const loadedCategories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
    
    setCategories(loadedCategories);
  };

  const filterCategories = (categories: Category[]) => {
    if (!debouncedSearch) return categories;
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      category.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  };

  const handleSave = async () => {
    const services = getFirebaseServices();
    if (!services) {
      toast({
        title: "Error",
        description: "Unable to connect to services",
        variant: "destructive"
      });
      return;
    }

    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const categoryData = {
        name: newCategory.name.trim(),
        slug: newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newCategory.description?.trim(),
        updatedAt: new Date(),
        ...(editingCategory ? {} : { createdAt: new Date() })
      };

      // Check for duplicate names
      const existing = categories.find(
        cat => cat.name.toLowerCase() === categoryData.name.toLowerCase() 
        && cat.id !== editingCategory?.id
      );

      if (existing) {
        toast({
          title: "Error",
          description: "A category with this name already exists",
          variant: "destructive"
        });
        return;
      }

      if (editingCategory) {
        await services.db.collection('blog_categories').doc(editingCategory.id).update(categoryData);
        toast({ title: "Success", description: "Category updated successfully" });
      } else {
        await services.db.collection('blog_categories').add(categoryData);
        toast({ title: "Success", description: "Category created successfully" });
      }

      setNewCategory({ name: '', description: '' });
      setEditingCategory(null);
      setIsDialogOpen(false);
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    const services = getFirebaseServices();
    if (!services) return;

    try {
      await services.db.collection('blog_categories').doc(categoryId).delete();
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Description (optional)"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCategories(categories).map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCategory(category);
                      setNewCategory({
                        name: category.name,
                        description: category.description || ''
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}