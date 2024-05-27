import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAsync,
} from '../../product/productSlice';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from '../../common/Modal';
import { useAlert } from 'react-alert';

function ProductForm() {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);
  const alert = useAlert();

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue('title', selectedProduct.title);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('discountPercentage', selectedProduct.discountPercentage);
      setValue('stock', selectedProduct.stock);
      setValue('brand', selectedProduct.brand);
      setValue('category', selectedProduct.category);
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = () => {
    const product = { ...selectedProduct, deleted: true };
    dispatch(updateProductAsync(product));
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'thumbnail' || key.startsWith('image')) {
        if (data[key][0]) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    console.log(formData)
    if (params.id) {
      formData.append('id', params.id);
      formData.append('rating', selectedProduct.rating || 0);
      console.log(formData)

      dispatch(updateProductAsync(formData));
      alert.success('Product Updated');
    } else {
      dispatch(createProductAsync(formData));
      alert.success('Product Created');
    }
    reset();
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" method='POST'>
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Add Product</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {selectedProduct && selectedProduct.deleted && (
                <h2 className="text-red-500 sm:col-span-6">This product is deleted</h2>
              )}

              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Product Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register('title', { required: 'name is required' })}
                      id="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register('description', { required: 'description is required' })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue=""
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about the product.</p>
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div className="col-span-full">
                <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900">Brand</label>
                <div className="mt-2">
                  <select
                    {...register('brand', { required: 'brand is required' })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">--choose brand--</option>
                    {brands.map((brand) => (
                      <option key={brand.value} value={brand.value}>{brand.label}</option>
                    ))}
                  </select>
                  {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
                <div className="mt-2">
                  <select
                    {...register('category', { required: 'category is required' })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">--choose category--</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register('price', { required: 'price is required', min: 1, max: 10000 })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="discountPercentage" className="block text-sm font-medium leading-6 text-gray-900">Discount Percentage</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register('discountPercentage', { required: 'discountPercentage is required', min: 0, max: 100 })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">Stock</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register('stock', { required: 'stock is required', min: 0 })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="thumbnail" className="block text-sm font-medium leading-6 text-gray-900">Thumbnail</label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register('thumbnail')}
                    id="thumbnail"
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="image1" className="block text-sm font-medium leading-6 text-gray-900">Image 1</label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register('image1')}
                    id="image1"
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="image2" className="block text-sm font-medium leading-6 text-gray-900">Image 2</label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register('image2')}
                    id="image2"
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="image3" className="block text-sm font-medium leading-6 text-gray-900">Image 3</label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register('image3')}
                    id="image3"
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {params.id && !selectedProduct.deleted && (
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => setOpenModal(true)}
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {params.id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>

      <Modal
        title="Delete Confirmation"
        message="Are you sure you want to delete this product?"
        dangerOption="Delete"
        cancelOption="Cancel"
        dangerAction={handleDelete}
        cancelAction={() => setOpenModal(false)}
        showModal={openModal}
      />
    </>
  );
}

export default ProductForm;
