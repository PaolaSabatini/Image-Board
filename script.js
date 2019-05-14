(function() {
    Vue.component("box", {
        template: "#modal-template",
        props: ["id"],
        data: function() {
            return {
                images: [],
                description: "",
                username: "",
                created_at: "",
                url: "",
                title: "",
                comments: [],
                comment: {
                    comment: "",
                    username: ""
                }
            };
        },

        mounted: function() {
            let self = this;
            console.log("self", self);
            axios.get("/images/" + self.id).then(function(res) {
                console.log("res from get request", res);
                self.images = res.data;
                console.log("data we gettinnnggg!", self.images);
                // self.comments = res.data;
                // console.log("SELF", self);
            });
        },
        watch: {
            imageid: function() {
                console.log("imageId has changed! IN WATCH");
                axios.get("/images").then(function(resp) {
                    self.images = resp.data;
                    console.log("self.images IN WATCH", self.images);
                    console.log("RESP.DATA IN WATCH", resp.data);
                });
            }
        },
        methods: {
            close: function() {
                console.log("I CAN SEE THAT");

                this.$emit("close");
            },
            insertcomments: function(e) {
                let self = this;
                console.log(this.comments);
                axios
                    .post("/images/" + self.id, self.comment)
                    .then(function(res) {
                        console.log("res in comments", res);
                        console.log("SELF.COMMENTS", self.comments);
                        self.comments.unshift(res.data[0]);
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            id: location.hash.slice(1) || 0,
            form: {
                title: "",
                username: "",
                description: "",
                url: "",
                file: null
            },
            showModal: false
        },
        mounted: function() {
            var self = this;

            window.addEventListener("hashchange", function() {
                console.log("hashchange");
                console.log("location: ", location.hash);

                self.id = location.hash.slice(1);
                console.log("self image.id", self.id);
            });

            axios.get("/images").then(function(resp) {
                self.images = resp.data;
                console.log("resp.data", resp.data);
            });
        },
        methods: {
            closeModal: function() {
                this.id = null;
                location.hash = "";
            },
            handleFileChange: function(e) {
                console.log("handleFileChange running!", e.target.files[0]);

                this.form.file = e.target.files[0];
            },
            uploadFile: function(e) {
                e.preventDefault();

                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("username", this.form.username);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);

                let self = this;

                axios.post("/upload", formData).then(function(res) {
                    self.images.unshift(res.data[0]);
                });
            },
            getMoreImages: function(e) {
                axios.get("/images").then(function(res) {
                    console.log("res from get more images", res);
                });
            }
        }
    });
})();
