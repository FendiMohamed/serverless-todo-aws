echo "Creating zip for layer"
zip -r layer.zip nodejs

echo "Creating zip for GET Function"
cd LambdaFunctionsWithLayer/get
zip -r get.zip index.mjs
mv get.zip ../../
cd ../..

echo "Creating zip for POST Function"
cd LambdaFunctionsWithLayer/post
zip -r post.zip index.mjs
mv post.zip ../../
cd ../..

echo "Creating zip for UPDATE Function"
cd LambdaFunctionsWithLayer/update
zip -r update.zip index.mjs
mv update.zip ../../
cd ../..

echo "Creating zip for DELETE Function"
cd LambdaFunctionsWithLayer/delete
zip -r delete.zip index.mjs
mv delete.zip ../../
cd ../..
echo "Success!"