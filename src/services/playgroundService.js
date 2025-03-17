const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/playgrounds`;

const index = async () => {
    try {
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const show = async (playgroundId) => {
    try {
        const res = await fetch(`${BASE_URL}/${playgroundId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
  };

  const create = async (playgroundFormData) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
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
};

  const createComment = async (playgroundId, commentFormData) => {
    try {
      const res = await fetch(`${BASE_URL}/${playgroundId}/comments`, {
        method: 'POST',
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
  




