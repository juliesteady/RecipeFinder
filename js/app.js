


//Add card components
  Vue.component('search_results', {
    props: {
      itemdata: Object,
      index: Number
      //image: String
    },
    template: `
    <v-card width="360px" height="300px" class="ma-4 d-flex flex-column" style="background-color: #3d5c5c" @click.stop="showDialog(itemdata, index)">
                    <v-img max-height="250"
                    :src="itemdata.image"></v-img>
                    <v-card-title class="text-h6 white--text">{{itemdata.title}}</v-card-title>
                        <!--<v-btn height="250px" style="background-color: #3d5c5c" class="white--text" @click="goToRecipe"> -->
                            <v-spacer></v-spacer>
                            </v-btn>
                <v-dialog
                v-model="dialog"
                @keydown.exc="cancel"
              >
                <v-card class="ma-4">
                  <v-card-title>
                    <span class="text-h5">{{title}}
                    </span>
                    <v-spacer></v-spacer>
                  <v-card-actions class="justify-end">
                    <v-btn
                      color="blue-darken-1"
                      text
                      @click.native="close"
                    >
                      Close
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      text
                      @click.native="save"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>

                   
                  </v-card-title>

                  <v-spacer></v-spacer>
                  

                  <v-card-text>
                    <v-container>

                    <v-row class="d-flex flex-row-reverse">
                    <v-col>
                    <v-img class="ml-auto" max-height="300" max-width="400"
                    :src="img"></v-img>

                    <v-container>
                    <v-row class="ml-auto">
                        <v-text-field v-model="detail"
                            label="Add comments" v-on:keyup.enter.native ="addDetails"
                          ></v-text-field>
                    </v-row>
                    </v-container>

                    <v-container>
                    <v-list dense>
                    <v-subheader>Comments: </v-subheader>
                    <v-list-item v-for="(detail, i) in details">
                    <v-list-item-content>
                    <v-list-item-title class="text-wrap" v-text="detail"></v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                    </v-list>
                    </v-container>

                    </v-col>
                    <v-col>
                    <v-list dense>
                    <v-subheader>Ingredients</v-subheader>
                    <v-list-item v-for="(ingredient, i) in ingredients">
                    <v-list-item-content>
                    <v-list-item-title class="text-wrap" v-text="ingredient"></v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                    </v-list>


                    <v-list dense>
                    <v-subheader>Steps</v-subheader>
                    <v-list-item v-for="(step, i) in steps">
                    <v-list-item-content>
                    <v-list-item-title class="text-wrap" v-text="step"></v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                    </v-list>

                    
                    </v-col>
                    
                    </v-row>

                      
                    </v-container>

                  </v-card-text>
                 
                </v-card>
              </v-dialog>
              </v-card>
              `
    ,
    data: function () {
      return {
        recipeInfo: [],
        recipeData: [],
        details:[],
        detail: '',
        title: null,
        img: null,
        steps: ['Steps not Available'],
        ingredients: ['Ingredients not Available'],
        dialog: false,
        recipeId: null,
        source_url: null,
      };
    },

    methods: {
      /*
      showDialog: function(item, index){
        this.$root.showDialog(item, index);
        //console.log("Reached here");
        //this.$ref.confirm.open();
        //this.dialog = true;
      }
      */
     async showDialog(item, index){
        this.recipeId = item.id;
        await this.getRecipeInfo(item);
        await this.getRecipeData(this.recipeInfo);
        this.title = item.title;
        this.img = item.image;
        this.source_url = this.recipeInfo.sourceUrl || "noUrl.com";
        this.steps = (this.getSteps(this.recipeData)) || ['Steps not Available'];
        this.ingredients = (this.getIngredients(this.recipeData.extendedIngredients)) || ['Ingredients not Available'];
        this.dialog = true;
        //this.title = item.title;
     },

     addDetails(){
        console.log(this.detail);
        if(this.details[0] == 'Steps not Available'){
          this.details[0] = this.detail;
        }else{
          this.details.push(this.detail);
        }
        this.detail = "";
     },


     makeVisible(){
      this.visible = true;
     },

     getIngredients(arr){
      var info = this;
      console.log(arr);
      //len = info.arr.length;
      result = []
      result.length = arr.length;

      var i = 0;
      while (i < arr.length){
        result[i] = arr[i].name;
        console.log(arr[i].name);
        i++;
      }

      return result;
     },

     getSteps(str){
      temp = ["Unable to find Steps"]
       if(str.instructions != null){
        temp = str.instructions.split('.');
        }else if (str.summary != null){
          newString = str.summary.replaceAll('<b>' , ' ');
          newString = newString.replaceAll('</b>', ' ');
          newString = newString.split('Similar recipes')[0];
          temp = newString.split('.'); 
        }
        
        return temp;
     },

     getRecipeInfo(item){
       var info = this;
      var options = {
        method: 'GET',
        url: 'https://webknox-recipes.p.rapidapi.com/recipes/' + item.id +'/information',
        headers: {
          'x-rapidapi-host': 'webknox-recipes.p.rapidapi.com',
          'x-rapidapi-key': '46efd81717mshc8c3344df217dc8p1663f9jsn6df8710c3a94'
        }
      };

      console.log(options.url);

      return axios.request(options).then(function (response) {
        console.log(response.data);
        
        info.recipeInfo = response.data;
        console.log(info.recipeInfo.sourceUrl);
        //this.getRecipeData(this.recipeInfo);
       // result = response.data;
        
      }).catch(function (error) {
      console.error(error);
      });
     // return new Promise(result);

     },

     //info.sourceURL
     getRecipeData(info){
       var recipe = this;
      var options = {
        method: 'GET',
        url: 'https://webknox-recipes.p.rapidapi.com/recipes/extract',
        params: {url: info.sourceUrl},
        headers: {
          'x-rapidapi-host': 'webknox-recipes.p.rapidapi.com',
          'x-rapidapi-key': '46efd81717mshc8c3344df217dc8p1663f9jsn6df8710c3a94'
        }
      };

      return axios.request(options).then(function (response) {
        console.log(response.data);
        
        //result = response.data;
        recipe.recipeData = response.data;
        
      }).catch(function (error) {
      console.error(error);
      });

      //return new Promise(result);

     },

     close() {
      this.dialog = false;
    },

    save() {

      //this.title.replaceAll("'", ' ');

      axios.post('data.php', {
        //request: 1,
        recipe_id: this.recipeId,
        title_recipe: this.title.replaceAll("'", ' '),
        ingredients: this.ingredients.join(", "),
        steps: this.steps.join(", "),
        photo: this.img,
        source_link: this.source_link,
        username: 'jsteady',
        password: 1234,
      }).then(function (response) {

        console.log(response);
        console.log("no errors");

      });


      this.dialog = false;
    }

    }
  });
  
  Vue.component('ingredient_list', {
    props: {
      title: String,
      index: Number
    },


    template: `
    
    <v-card class="ma-4 d-flex flex-column" height="100" width="150">
    <v-card-title>{{title}}</v-card-title>
    <v-btn @click.native="clearMessage('index')">Remove</v-btn>
    </v-card>
    
  
`,
  

methods: {
clearMessage(){
  info= this;
  console.log(this.index);
  console.log(app.ingredient);
  //this.ingredients.indexOf();
  
    //someArray.splice(i, 1);
  
  
    app.ingredient.splice(this.index, 1);
  
  //return arr;

}
}
  });


  var app = new Vue({
      el: '#app',
      vuetify: new Vuetify(),
      data: {
        searchResults: [
          {title: "Quick Apple Pies", image: "https://spoonacular.com/recipeImages/618390-312x231.jpg"},
          {title: "Apple Stresel", image: "https://spoonacular.com/recipeImages/611873-556x370.jpg"},
          {title: "PAIN AU CHOCOLAT", image: "https://spoonacular.com/recipeImages/542166-312x231.jpg"}
        ],
        ingredient: [
          {title: "apples"},
          {title: "flour"},
          {title: "sugar"}
      
        ],
        dialog: false,
        food: '',
        },
        methods: {

          clearAll(){
            app.ingredient.splice(0);
          },

          addFood(){
            
            app.ingredient.push({title: this.food});
            console.log(app.ingredient);
            
            this.food = "";
          },

          showFavorites(){
            axios.get('favs.php').then(function (response) {
              console.log(response.data);
              
              temp = response.data.split('{')[1];
              temp.split('}')[0];
              temp = temp.replaceAll("*", '"');
              temp = '{' + temp;
              JSON.parse(temp);
              //console.log(temp);
              
              //response.data.split(', ');
              //app.searchResults = response.data;
            });
          },

            testRecipe(){
              console.log("test");
            },

            showDialog(item, index){
              console.log("Reached here");
              //this.dialogBox.open();
              //this.dialog = true;
              this.$refs.confirm.open();
              //this.dialog = true;
            },

            open(){
              this.dialog = true;
            },
      
            close(){
              console.log("Placeholder: dialog box closed");
              this.dialog = false;
            },
      
            save() {
              console.log("Placeholder: record saved");
              this.dialog = false;
            },


            
            searchFor(){
              
              str = "";
              var i = 0;
              while(i < app.ingredient.length){
                if(i!=0){
                  str += ',';
                }
                  str += app.ingredient[i].title;
                  console.log(str);
                i++;
              }
              
              var options = {
                method: 'GET',
                url: 'https://webknox-recipes.p.rapidapi.com/recipes/findByIngredients',
                params: {ingredients: str , number: '20'},
                headers: {
                  'x-rapidapi-host': 'webknox-recipes.p.rapidapi.com',
                  'x-rapidapi-key': '46efd81717mshc8c3344df217dc8p1663f9jsn6df8710c3a94'
                }
              };
              console.log("2");
              axios.request(options).then(function (response) {
                console.log(response.data);

                
                app.searchResults = response.data;
                //console.log(this.searchResults);
              }).catch(function (error) {
	            console.error(error);
              });
            }
            
           

        
        }
  });
