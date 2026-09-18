export interface Category {
  category_name: string,
  description: string,
  items: {
    title: string,
    versions: {
      title: string,
      description: string,
      images: string[]
    }[]
  }[]
}

export interface Project {
  images: string[]
}
