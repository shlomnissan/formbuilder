<li class="form-element {#required}required{/required}" id="element-{position}" data-label="{label}" data-position="{position}" data-type="element-multiple-choice">

	<label>
		<span class="label-title">{label}</span>
		{#required}<span class="required-star"> *</span>{/required}
	</label>

	<div class="choices" data-type="settings-choice-radio">

		<div class="choice radio disabled">
		  <label>
		    <input type="radio" class="option-1" name="element-{position}-choice" value="First Choice" checked disabled>
		    <span class="choice-label">First Choice</span>
		  </label>
		</div>

		<div class="choice radio disabled">
		  <label>
		    <input type="radio" class="option-2" name="element-{position}-choice" value="Second Choice" disabled>
		    <span class="choice-label">Second Choice</span>
		  </label>
		</div>

		<div class="choice radio disabled">
		  <label>
		    <input type="radio" class="option-3" name="element-{position}-choice" value="Third Choice" disabled>
		    <span class="choice-label">Third Choice</span>
		  </label>
		</div>

	</div>

</li>