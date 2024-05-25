export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/products/${id}`);
    const data = await response.json();
    resolve({ data });
  });
}

export function createProduct(product) {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('discountPercentage', product.discountPercentage);
      formData.append('stock', product.stock);
      formData.append('brand', product.brand);
      formData.append('category', product.category);

      if (product.thumbnail) {
        formData.append('thumbnail', product.thumbnail);
      }

      if (product.images) {
        product.images.forEach((image, index) => {
          formData.append(`image${index + 1}`, image);
        });
      }

      const response = await fetch('http://localhost:8080/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create product: ${errorData.message}`);
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('id', update.id);
      formData.append('title', update.title);
      formData.append('description', update.description);
      formData.append('price', update.price);
      formData.append('discountPercentage', update.discountPercentage);
      formData.append('stock', update.stock);
      formData.append('brand', update.brand);
      formData.append('category', update.category);
      formData.append('rating', update.rating);

      if (update.thumbnail) {
        formData.append('thumbnail', update.thumbnail);
      }

      if (update.images) {
        update.images.forEach((image, index) => {
          formData.append(`image${index + 1}`, image);
        });
      }

      const response = await fetch(`http://localhost:8080/products/${update.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchProductsByFilters(filter, sort, pagination, admin) {
  let queryString = '';
  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      const lastCategoryValue = categoryValues[categoryValues.length - 1];
      queryString += `${key}=${lastCategoryValue}&`;
    }
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }
  if (admin) {
    queryString += `admin=true`;
  }

  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/products?${queryString}`);
    const data = await response.json();
    const totalItems = await response.headers.get('X-Total-Count');
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/categories');
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/brands');
    const data = await response.json();
    resolve({ data });
  });
}
