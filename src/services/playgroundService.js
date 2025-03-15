const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/playgrounds`;

const index = async () => {
    try {
      console.log('Calling index API...');
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      console.log('Index API response:', data);
      
      // Check if authors are populated in the response
      if (data && Array.isArray(data)) {
        data.forEach((playground, idx) => {
          console.log(`Playground ${idx} author:`, playground.author);
          if (playground.comments && playground.comments.length > 0) {
            playground.comments.forEach((comment, cidx) => {
              console.log(`Playground ${idx} comment ${cidx} author:`, comment.author);
            });
          }
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error in index API:', error);
      throw error;
    }
  };
  
  const show = async (playgroundId) => {
    try {
        console.log(`Calling show API for playground ${playgroundId}...`);
        const res = await fetch(`${BASE_URL}/${playgroundId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        console.log('Show API response:', data);
        
        // Check if author is populated in the response
        if (data) {
          console.log('Playground author:', data.author);
          if (data.comments && data.comments.length > 0) {
            data.comments.forEach((comment, idx) => {
              console.log(`Comment ${idx} author:`, comment.author);
            });
          }
        }
        
        return data;
    } catch (error) {
        console.error(`Error in show API for playground ${playgroundId}:`, error);
        throw error;
    }
  };

  const create = async (playgroundFormData) => {
    try {
      console.log('Calling create API with data:', playgroundFormData);
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playgroundFormData),
      });
      const data = await res.json();
      console.log('Create API response:', data);
      return data;
    } catch (error) {
      console.error('Error in create API:', error);
      throw error;
    }
};

  const createComment = async (playgroundId, commentFormData) => {
    try {
      console.log(`Calling createComment API for playground ${playgroundId} with data:`, commentFormData);
      const res = await fetch(`${BASE_URL}/${playgroundId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentFormData),
      });
      const data = await res.json();
      console.log('CreateComment API response:', data);
      
      // Check if author is populated in the response
      if (data && data.author) {
        console.log('New comment author:', data.author);
      } else {
        console.warn('Author not populated in createComment response!');
      }
      
      return data;
    } catch (error) {
      console.error(`Error in createComment API for playground ${playgroundId}:`, error);
      throw error;
    }
  };

  const deletePlayground = async (playgroundId) => {
    try {
      const res = await fetch(`${BASE_URL}/${playgroundId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function update(playgroundId, playgroundFormData) {
    try {
      const res = await fetch(`${BASE_URL}/${playgroundId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playgroundFormData),
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteComment = async (playgroundId, commentId) => {
    try {
      const res = await fetch(`${BASE_URL}/${playgroundId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  const updateComment = async (playgroundId, commentId, commentFormData) => {
    try {
      const res = await fetch(`${BASE_URL}/${playgroundId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentFormData),
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };
  
  export { 
    index,
    show,
    create,
    createComment,
    deletePlayground,
    update,
    deleteComment,
    updateComment
  };
  



