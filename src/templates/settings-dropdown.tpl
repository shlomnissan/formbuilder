{#choices}
<div class="radio choice">
	
	<label>
		<input type="radio" name="choice" class="option" {#checked}checked{/checked}>&nbsp;
	</label>

	<input type="text" class="bind-control" data-bind=".{bindingClass}" style="display: inline-block; width: 65%;" value="{title}" />&nbsp;
	
	<button class="button success add-choice">+</button>&nbsp;
	<button class="button danger remove-choice" data-delete=".{bindingClass}">-</button>

</div>
{/choices}